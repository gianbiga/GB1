var express = require('express');//declara o módulo express quando ele já estiver instalado
var path = require('path');//declara o módulo path, que já vem instalado
var bodyParser = require('body-parser');
var fs = require('fs'); //File System module para ler ou criar arquivos
var gulp = require('gulp');//compilador de less
var less = require('gulp-less'); //compilador de less
var zip = new require('node-zip')();//modulo para transformar em zip 
var archiver = require('archiver'); //zipa a pasta inteira
require('./gulpfile');//lê o aquivo gulpfile, que possui as funções para compilar o less
const lessVariablesToJson = require('less-variables-to-json');

var app = express();
app.use(bodyParser.json());
let json;
//direciona o caminho dos seus recursos, como css, js, html para a pasta que você desejar, no caso, a public.
//Agora, é possível criar arquivos dentro dessa pasta que sobrescreverão o callback abaixo, como uma página index.html
app.use(express.static(path.join(__dirname, 'public')));

//Master - Backup
app.post('/api/1.0/Generate', function(req, res){

//Funcao para ler o arquivo "_variables.less"
	fs.readFile("less/_variables.less", "utf8", function(err, data){
		if(err){throw err;}

		lessVariablesToJson(data).then((result) => {

		var body = req.body;
		var lessFinal = "";
		for(keyFile in result){
			c=0;
			for(keyAPI in body){
				if(keyFile == '@'+keyAPI){
					result[keyFile] = body[keyAPI];
				}
			}

			if(c<Object.keys(body).length){lessFinal = lessFinal + keyFile + ":" + result[keyFile] + ";";}	
			console.log(Object.keys(body).length);
			c=c=+1;
		}

		fs.writeFile("less/new_variables.less", lessFinal, (err) => {
			if(err) throw err;
			console.log("Arquivo Salvo!");
		});
    	gulp.start('default');
		res.send(result);
		})
	})

})


//Reaproveitamento
function compilaCss(req, res){
//Funcao para ler o arquivo "_variables.less"
	fs.readFile("less/_variables.less", "utf8", function(err, data){
		if(err){throw err;}

		lessVariablesToJson(data).then((result) => {

		var body = req.body;
		var lessFinal = "";
		for(keyFile in result){
			c=0;
			for(keyAPI in body){
				if(keyFile == '@'+keyAPI){
					result[keyFile] = body[keyAPI];
				}
			}

			if(c<Object.keys(body).length){lessFinal = lessFinal + keyFile + ":" + result[keyFile] + ";";}	
			console.log(Object.keys(body).length);
			c=c=+1;
		}

		fs.writeFile("less/new_variables.less", lessFinal, (err) => {
			if(err) throw err;
			console.log("Arquivo Salvo!");
		});
    	gulp.start('default');
		res.send(result);
		})
	})

}

//Reaproveitamento - Preview
app.post('/api/1.0/Preview2', function(req, res){
	compilaCss(req,res);
})

//Preview - Retorna o css desejado (home, config ou commerce)
app.post('/api/1.0/Preview', function(req, res){

	//Funcao para ler o arquivo "_variables.less"
	fs.readFile("less/_variables.less", "utf8", function(err, data){
		if(err){throw err;}

		//Transforma o _variables.less em um JSON
		lessVariablesToJson(data).then((result) => {
		var body = req.body;
		var lessFinal = "";
		//Lê cada key:value do arquivo JSON gerado do variables
		for(keyFile in result){
			c=0;
		//Lê cada linha do body enviado para cada linha do JSON _variables.less
			for(keyAPI in body){
				if(keyFile == '@'+keyAPI){
					result[keyFile] = body[keyAPI];
				}
			}
		//Gera um string com todas as chave:valor atualizadas
			if(c<Object.keys(body).length){lessFinal = lessFinal + keyFile + ":" + result[keyFile] + ";";}	
			//console.log(Object.keys(body).length);
			c=c=+1;
		}
		//Gera um arquivo new_variables.less com os parametros atualizados
		fs.writeFileSync("less/new_variables.less", lessFinal, (err) => {
			if(err) throw err;
			console.log("Arquivo Salvo!");
		});
		//Compila os arquivos less com os novos parametros 
    	var a = gulp.start('default');

    	//Cria o Zip
		//zip.file('less/new_variables.less', fs.readFileSync(path.join(__dirname, 'less')));
		//var data = zip.generate({ base64:false, compression: 'DEFLATE' });
		//// it's important to use *binary* encode
		//fs.writeFileSync('test.zip', data, 'binary');
		//console.log(data);
		
		//var output = file_system.createWriteStream('target.zip');
		//var archive = archiver('zip');
		//
		//output.on('close', function () {
		//    console.log(archive.pointer() + ' total bytes');
		//    console.log('archiver has been finalized and the output file descriptor has closed.');
		//});
		//archive.on('error', function(err){
		//    throw err;
		//});
		//archive.pipe(output);
		//archive.bulk([
		//    { expand: true, cwd: 'source', src: ['**'], dest: 'source'}
		//]);
		//archive.finalize();

    	res.send(result);
		})
	})

	//fs.readFile("_dist/home.css", "utf8", function(err, data){
	//if(err){throw err;}
	//res.send(data);
	//})

})

//Download - Retorna o zipado para download (home, config ou commerce)
app.post('/api/1.0/Download', function(req, res){

	//Funcao para ler o arquivo "_variables.less"
	fs.readFile("less/_variables.less", "utf8", function(err, data){
		if(err){throw err;}

		//Transforma o _variables.less em um JSON
		lessVariablesToJson(data).then((result) => {
		var body = req.body;
		var lessFinal = "";
		//Lê cada key:value do arquivo JSON gerado do variables
		for(keyFile in result){
			c=0;
		//Lê cada linha do body enviado para cada linha do JSON _variables.less
			for(keyAPI in body){
				if(keyFile == '@'+keyAPI){
					result[keyFile] = body[keyAPI];
				}
			}
		//Gera um string com todas as chave:valor atualizadas
			if(c<Object.keys(body).length){lessFinal = lessFinal + keyFile + ":" + result[keyFile] + ";";}	
			//console.log(Object.keys(body).length);
			c=c=+1;
		}
		//Gera um arquivo new_variables.less com os parametros atualizados
		fs.writeFileSync("less/new_variables.less", lessFinal, (err) => {
			if(err) throw err;
			console.log("Arquivo Salvo!");
		});
		//Compila os arquivos less com os novos parametros 
    	var a = gulp.start('default');
    	res.send(a);
		})
	})

	//fs.readFile("_dist/home.css", "utf8", function(err, data){
	//if(err){throw err;}
	//res.send(data);
	//})

})



//inicia o servidor na porta 3000
app.listen(3000, function(){
	console.log("Hello Server!");
})
