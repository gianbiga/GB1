var express = require('express');//declara o módulo express quando ele já estiver instalado
var path = require('path');//declara o módulo path, que já vem instalado
var bodyParser = require('body-parser');
var fs = require('fs'); //File System module para ler ou criar arquivos
var gulp = require('gulp');//compilador de less
var less = require('gulp-less'); //compilador de less
var zip = new require('node-zip')();//modulo para transformar em zip 
var archiver = require('archiver'); //zipa a pasta inteira
require('./gulpfile');//lê o aquivo gulpfile, que possui as funções para compilar o less
var copydir = require('copy-dir'); //copia pastas
const lessVariablesToJson = require('less-variables-to-json');

var app = express();
app.use(bodyParser.json());
let json;
//direciona o caminho dos seus recursos, como css, js, html para a pasta que você desejar, no caso, a public.
//Agora, é possível criar arquivos dentro dessa pasta que sobrescreverão o callback abaixo, como uma página index.html
app.use(express.static(path.join(__dirname, 'public')));


/*Requests*/

////Preview - Retorna o css desejado (home, config ou commerce)
app.post('/api/1.0/preview', function(req, res){
	compilaCss(req,res);
	setTimeout(function(){
		fs.readFile("_dist/"+req.body.page+".css", "utf8", function(err, data){
			if(err){throw err;}
			res.send(data);
		})
	}, 500);
})

//Download - Retorna o zipado para download (home, config ou commerce)
app.get('/api/1.0/download/:themeID', function(req, res){
	zipContent(2,'themes/'+req.params.themeID+'/'+req.params.themeID,'themes/'+req.params.themeID+'/files',req.params.themeID);
	var file = __dirname + '/themes/'+req.params.themeID+'/'+req.params.themeID+'.zip';
 	res.download(file); // Set disposition and send it.
})

//GetThemeId - Pega o ID do tema gerado pelo front e cria a estrutura de pastas
app.get('/api/1.0/theme/:themeID', function(req, res){
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
function compilaCss(req, res){

	//Funcao para ler o arquivo "_variables.less"
	fs.readFile("less/_variables.less", "utf8", function(err, data){
		if(err){throw err;}

		lessVariablesToJson(data).then((result) => {
			var body = req.body.props;
			var lessFinal = "";

			for(keyFile in result){
				c=0;
				for(keyAPI in body){
					if(keyFile == '@'+keyAPI){
						result[keyFile] = body[keyAPI];
					}
				}
				if(c<Object.keys(body).length){lessFinal = lessFinal + keyFile + ":" + result[keyFile] + ";";}	
				//console.log(Object.keys(body).length);
				c=c=+1;
			}

		fs.writeFile("less/new_variables.less", lessFinal, (err) => {
			if(err) throw err;
			//console.log("Arquivo Salvo!");
		});
    	
    	
		})
	})

	return gulp.start('default');

}


//inicia o servidor na porta 3000
app.listen(process.env.PORT || 3000, function(){
	console.log("Hello Server!");
})
