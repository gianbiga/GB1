var express = require('express');//declara o módulo express quando ele já estiver instalado
var path = require('path');//declara o módulo path, que já vem instalado
var bodyParser = require('body-parser');
var fs = require('fs'); //File System module para ler ou criar arquivos
var less = require('less/lib/less-node');
var zip = new require('node-zip')();//modulo para transformar em zip 
var archiver = require('archiver'); //zipa a pasta inteira
//require('./gulpfile');//lê o aquivo gulpfile, que possui as funções para compilar o less
var copydir = require('copy-dir'); //copia pastas
var mkdirp = require('mkdirp'); //cria pastas
//const lessVariablesToJson = require('less-variables-to-json');
var dashify = require('dashify'); //Convert a camelcase or space-separated string to a dash-separated string
//var Q = require('q'); //Cascate Callbacks
//const lessToJs = require('less-vars-to-js');
var CleanCSS = require('clean-css'); //minify css


var app = express();
app.use(bodyParser.json());
let json;
//direciona o caminho dos seus recursos, como css, js, html para a pasta que você desejar, no caso, a public.
//Agora, é possível criar arquivos dentro dessa pasta que sobrescreverão o callback abaixo, como uma página index.html
app.use(express.static(path.join(__dirname, 'public')));

//Add CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST , GET , PUT , DELETE , OPTIONS");
  next();
});


////Preview - Retorna o css desejado (home, config ou commerce)
app.post('/api/1.0/preview', function(req, res){
	var page = req.body.page;
	var props = req.body.props;

	fs.readFile("base/_variables.less", "utf8", function(err, data){

		for(key in props){
			var inputKey = dashify(key);
			var inputValue = props[key];

			var posKey = data.search(inputKey+":");
			var pos2Dots = data.search(inputKey) + inputKey.length;
			var possColon = data.indexOf(";",data.search(inputKey) + inputKey.length);

			var key = data.slice(posKey,pos2Dots);
			var keyValue = data.slice(posKey,possColon);
			var value = data.slice(pos2Dots+1,possColon);

			data = data.replace(keyValue, key+":"+inputValue);

		}
		fs.writeFile("base/new_variables.less", data, function(err, data){

			//Compile less from less path
			fs.readFile("less/"+page+".less", "utf8", function(err, result){
				if(err){throw err;}
				less.render(result,{ filename: path.resolve("less/"+page+".less")})
					.then(function(css) {
							fs.writeFile("_dist/"+page+".css", css.css, (err) => {});
							//Minify CSS
							var options = { /* options */ };
							var minCss = new CleanCSS(options).minify(css.css);
							res.send(minCss.styles);
				})
			})
		});
	})
})


//Download - Retorna o zipado para download (home, config ou commerce)
app.get('/api/1.0/download/:themeID',function(req, res){
	zipContent(2,'themes/'+req.params.themeID+'/'+req.params.themeID,'themes/'+req.params.themeID+'/files',req.params.themeID);
	var file = __dirname + '/themes/'+req.params.themeID+'/'+req.params.themeID+'.zip';
 	res.download(file); // Set disposition and send it.
})

//GetThemeId - Pega o ID do tema gerado pelo front e cria a estrutura de pastas
app.get('/api/1.0/theme/:themeID', function(req, res){

	mkdirp('themes/'+req.params.themeID+'/files', function (err) {
	    if (err) console.error(err)
	    else console.log('pow!')
	});
	cloneDir(req.params.themeID);
	res.send('Directory for theme: '+req.params.themeID+' created with success!');
})

/*Functions*/

//Cria uma pasta com o valor do ID e clona os arquivos necessários
function cloneDir(themeID){
copydir.sync('themes/default', 'themes/'+themeID+'/files');
}

//zipType = {1:file, 2:folder}
//zipPathName: Create a name zip on path /my/files/path
//zippedContent = if(file){test.txt}, if(folder){folderName with path. Eg: my/files/folder}
function zipContent(zipType,zipPathName,zippedPath,zippedName){
	// create a file to stream archive data to.
		var output = fs.createWriteStream(__dirname + '/'+zipPathName+'.zip');
		var archive = archiver('zip');
		 
		// listen for all archive data to be written
		// 'close' event is fired only when a file descriptor is involved
		output.on('close', function() {
		  console.log(archive.pointer() + ' total bytes');
		  console.log('archiver has been finalized and the output file descriptor has closed.');
		});
		 
		// This event is fired when the data source is drained no matter what was the data source.
		// It is not part of this library but rather from the NodeJS Stream API.
		// @see: https://nodejs.org/api/stream.html#stream_event_end
		output.on('end', function() {
		  console.log('Data has been drained');
		});
		 
		// good practice to catch warnings (ie stat failures and other non-blocking errors)
		archive.on('warning', function(err) {
		  if (err.code === 'ENOENT') {
		    // log warning
		  } else {
		    // throw error
		    throw err;
		  }

		});
 
		// good practice to catch this error explicitly
		archive.on('error', function(err) {
		  throw err;
		});
		 
		// pipe archive data to the file
		archive.pipe(output);

		switch(zipType){

			case 1:
			//append a file from stream
			var file1 = __dirname + '/'+zippedContent;
			archive.append(fs.createReadStream(file1), { name: zippedContent });
			break;

			case 2:
			console.log("caso2");			
			// append files from a sub-directory and naming it `new-subdir` within the archive
			archive.directory(zippedPath+'/', zippedName);
			break;
		}
		
		// finalize the archive (ie we are done appending files but streams have to finish yet)
		// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
		archive.finalize();
}

//Recebe json com alterações do CSS do Front, gera um novo variables.less (new_variables.less) e compila o home/config/commerce.less
/*function compilaCss(req, res, page){

	var deferred = Q.defer();

	//Funcao para ler o arquivo "_variables.less"
	fs.readFile("less/variables.less", "utf8", function(err, data){
		if(err){throw err;}

		var options = {};
		options['modifyVars'] = {'@font-size-base': '219px'};
		less.render(data, { filename: path.resolve("less/home.less") }).then(function(rep){
			console.log(rep)
			fs.writeFile("base/teste555.less", rep.css, (err) => {});
		}).catch(function(rep){
			console.log(rep)
		});
		return false;

		lessVariablesToJson(data).then((result) => {
			var body = req.body.props;
			var lessFinal = "";

			for(keyFile in result){
				c=0;
				for(keyAPI in body){
					if(keyFile == '@'+dashify(keyAPI)){
						result[keyFile] = body[keyAPI];
					}
				}
				if(c<Object.keys(body).length){lessFinal = lessFinal + keyFile + ":" + result[keyFile] + ";";}	
				//console.log(Object.keys(body).length);
				c=c=+1;
			}

			fs.writeFile("base/new_variables.less", lessFinal, (err) => {
				if(err) throw err;
				console.log("Arquivo Salvo!");
				var options = {};
				//options['modifyVars'] = {'@font-size-base': '219px'};
					fs.readFile("base/"+page+".less", "utf8", function(err, data){
						if(err){throw err;}
							less.render(data,{ filename: path.resolve("base/"+page+".less"),})
							.then(function(css) {
								if (err) {
							        deferred.reject(new Error(err));
							    } else {
							        deferred.resolve(css.css);
							        fs.writeFile("base/teste555.less", css.css, (err) => {});
							        //console.log(css)
							    }
							},
							function(error2) {
							    console.log(error2);
					});
				})
			});
     	
		})
	})*/

/*return deferred.promise;
}
*/
//inicia o servidor na porta 3000
app.listen(process.env.PORT || 3000, function(){
	console.log("Run Builder Run!");
})
