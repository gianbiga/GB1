var express = require('express');//declara o módulo express quando ele já estiver instalado
var path = require('path');//declara o módulo path, que já vem instalado
var bodyParser = require('body-parser');
var fs = require('fs'); //File System module para ler ou criar arquivos
var less = require('gulp-less'); //compilador de less
const lessVariablesToJson = require('less-variables-to-json');

var app = express();
app.use(bodyParser.json());
let json;
//direciona o caminho dos seus recursos, como css, js, html para a pasta que você desejar, no caso, a public.
//Agora, é possível criar arquivos dentro dessa pasta que sobrescreverão o callback abaixo, como uma página index.html
app.use(express.static(path.join(__dirname, 'public')));


gulp.task('precompile', function(){
	return app.src('./less/*.less')
	.pipe(less({
		compress:true,
	}))
	.pipe(app.dest('./css'));
})

/***CPQ Builder***/

//Generate
app.post('/api/1.0/Generate', function(req, res){
	var body = req.body;
	//console.log(body.font_size_large);



	fs.readFile("less/_variables.less", "utf8", function(err, data){
		if(err){throw err;}
		//console.log(data);

lessVariablesToJson(data).then((result) => {
	//json = JSON.parse(result);  // json = { "@primary-color": "red" } 
	//result[x] = "ceil((@font-size-base * "+body.standard.font_size_h3+"))";


	//for(var key1 in result){
	//	var value = result[key1];
	//	console.log(key1);
		//console.log(value);


		for(var key2 in body){
			//console.log(key2);
			//console.log(value);
			//if(req.body[key2] == result[key1]){
				console.log(key2);
				console.log(body[key2]);
			//}
		}

	//}

	res.send(result);
 
//result["@font-family"] = standard.font-family;
//result["@font-size-base"] = standard.font-size-base;


//Manual - Deprecated
/*
//Standard Variables
result["@base-path"] = "/bmfsweb/{"+body.standard.base_path[0]+"}/image/{"+body.standard.base_path[0]+"}";
result["@font-family"] = body.standard.font_family;
result["@font-size-base"] = body.standard.font_size_base;
result["@font-size-large"] = "ceil((@font-size-base * "+body.standard.font_size_large+"))";
result["@font-size-h3"] = "ceil((@font-size-base * "+body.standard.font_size_h3+"))";
result["@primary-color"] = body.standard.primary_color;
result["@primary-color-light"] = "lighten(@primary-color, "+body.standard.primary_color_light+")";
result["@primary-color-dark"] = "darken(@primary-color, "+body.standard.primary_color_dark+")";
result["@alternate-color"] = body.standard.alternate_color;
result["@alternate-extreme-color"] = body.standard.alternate_extreme_color;
result["@gray-base"] = body.standard.gray_base;
result["@gray"] = "lighten(@gray-base, "+body.standard.gray+")";
result["@gray-light"] = "lighten(@gray-base, "+body.standard.gray_light+")";
result["@gray-lighter"] =  "lighten(@gray-base, "+body.standard.gray_lighter+")";
result["@menubar-bgColor"] = "fade(@primary-color,"+body.standard.menubar_bgColor+")"; 


//Loader Variables
result["@loader-bgColor"] = body.loader.loader_bgColor;
result["@loader-color"] = "@primary_color";
result["@loader-padding"] = body.loader.loader_padding;
result["@loader-icon"] = body.loader.loader_icon;
result["@loader-overlay-bgColor"] = body.loader.loader_overlay_bgColor;
result["@loader-size"] = body.loader.loader_size;

//HomePage
result["@bgimage-home"] = "@{base-path}/bg.jpg";
result["@logo-home"] = "@{base-path}/logo.png";
result["@logo-home-width"] = body.homePage.logo_home_width;
result["@logo-home-height"] = body.homePage.logo_home_height;
result["@firstlink-color"] = "@primary_color";
result["@firstlink-hoverColor"] = "@alternate_color";
result["@firstlink-bgColor"] = body.homePage.firstlink_bgColor;
result["@firstlink-hoverbg"] = "@primary_color";
result["@search-nav-display"] = body.homePage.search_nav_display;
result["@tabs-display"] = body.homePage.tabs_display;

//ConfigFlow
//Reset Display
result["@button-bar-display"] = body.configFlow.resetDisplay.button_bar_display;
result["@button-startover-display"] = body.configFlow.resetDisplay.button_startover_display;
result["@button-update-display"] = body.configFlow.resetDisplay.button_update_display;
result["@pricingContent-display"] = body.configFlow.resetDisplay.pricingContent_display;
result["@bottomBar-display"] = body.configFlow.resetDisplay.bottomBar_display;
result["@recommendation-section-display"] = body.configFlow.resetDisplay.recommendation_section_display;
result["@pipelineViewer-display"] = body.configFlow.resetDisplay.pipelineViewer_display;

//Background Image
result["@bgimage-cfg"] = "@bgimage-home";


//LOGO VARIABLES
result["@logo-cfg"] = "@logo-home";
result["@logoConfig-display"] = body.configFlow.logo.logoConfig_display;
result["@logo-cfg-margin"] = body.configFlow.logo.logo_cfg_margin;
result["@logo-cfg-width"] = body.configFlow.logo.logo_cfg_width;
result["@logo-cfg-height"] = body.configFlow.logo.logo_cfg_height;

//MAIN CONTENT VARIABLES
result["@main-content-marginTop"] = body.configFlow.mainContent.main_content_marginTop;
result["@main-content-width"] = body.configFlow.mainContent.main_content_width;

//TAB VARIABLES
result["@tab-text-color"] = "@alternate-color";
result["@tab-strip-bgColor"] = "@primary-color-light";
result["@tab-strip-borderBottomColor"] = body.configFlow.tab.tab_strip_borderBottomColor;
result["@tab-hover-bgColor"] = "lighten(@primary-color, "+body.configFlow.tab.tab_hover_bgColor+")";
result["@tab-active-text-color"] = "@{alternate-color}!important";
result["@tab-active-bgColor"] = "@{primary-color}!important";
result["@tab-active-borderBottomColor"] = "@alternate-extreme-color";
result["@tab-content-padding"] = body.configFlow.tab.tab_content_padding;

//FIELDSET HEADER VAIRABLES
result["@groupheader-fontSize"] = "@{font-size-h3}!important";
result["@groupheader-textTransform"] = body.configFlow.fieldsetHeader.groupheader_textTransform;
result["@groupheader-margin"] = body.configFlow.fieldsetHeader.groupheader_margin;
result["@groupheader-strokeColor"] = "fade(@primary-color, "+body.configFlow.fieldsetHeader.groupheader_strokeColor+")";
result["@fieldset-padding"] = body.configFlow.fieldsetHeader.fieldset_padding;

//LABEL, INPUT & TEXT AREA VARIABLES
result["@attr-padding"] = body.configFlow.LabelInputTextArea.attr_padding;
result["@input-minHeight"] = body.configFlow.LabelInputTextArea.input_minHeight;
result["@input-padding"] = body.configFlow.LabelInputTextArea.input_padding;
result["@input-fontSize"] = "@font-size-large";
result["@input-border"] = body.configFlow.LabelInputTextArea.input_border;
result["@input-bgColor"] = "fade(@primary-color," +body.configFlow.LabelInputTextArea.input_bgColor+")";
result["@input-color"] = "@alternate-color";
result["@input-textAlign"] = body.configFlow.LabelInputTextArea.input_textAlign;
result["@input-borderRadius"] = body.configFlow.LabelInputTextArea.input_borderRadius;
result["@input-focus-bgColor"] = "@input-bgColor";
result["@input-focus-color"] = "@input-color";
result["@input-focus-border"] = "@input-border";
result["@input-message-background"] = "@gray-base";
result["@input-message-color"] = "@alternate-color";
result["@input-message-borderRadius"] = body.configFlow.LabelInputTextArea.input_message_borderRadius;

//DROPDOWN VARIABLES
result["@dropdown-maxHeight"] = "@input-minHeight";
result["@dropdown-bgColor"] = "@input-bgColor";
result["@dropdown-border"] = body.configFlow.dropdown.dropdown_border + "@primary-color";

//DEFAULT PICKLIST VARIABLES
result["@picklist-padding"] = body.configFlow.defaultPicklist.picklist_padding;
result["@picklist-marginRight"] = body.configFlow.defaultPicklist.picklist_marginRight;
result["@picklist-bgColor"] = body.configFlow.defaultPicklist.picklist_bgColor;
result["@picklist-borderSize"] = body.configFlow.defaultPicklist.picklist_borderSize;
result["@picklist-borderColor"] = body.configFlow.defaultPicklist.picklist_borderColor;
result["@picklist-color"] = "@primary-color";
result["@picklist-hover-bgColor"] = "fade(@primary-color, "+body.configFlow.defaultPicklist.picklist_hover_bgColor+")";
result["@picklist-selected-borderColor"] = body.configFlow.defaultPicklist.picklist_selected_borderColor;
result["@picklist-selected-bgColor"] = "fade(@primary-color, "+body.configFlow.defaultPicklist.picklist_selected_bgColor+")";
result["@picklist-selected-color"] = "@alternate-color";
result["@picklist-dropdown-bgColor"] = "@input-bgColor";
result["@picklist-dropdown-arrow"] = "@{base-path}/arrow-down.png";

//MAIN PICKLIST VARIABLES
result["@picklist-main-padding"] = "@picklist-padding * "+body.configFlow.mainPicklist.picklist_main_padding;
result["@picklist-main-marginRight"] = "@picklist-marginRight * "+body.configFlow.mainPicklist.picklist_main_marginRight;
result["@picklist-main-fontSize"] = "@font-size-large";
result["@picklist-main-fontWeight"] = body.configFlow.mainPicklist.picklist_main_fontWeight;
result["@picklist-main-selected-bgColor"] = "@picklist-selected-bgColor";
result["@picklist-main-hover-bgColor"] = "@picklist-hover-bgColor";

//ARRAYLIST VARIABLES
result["@arrayList-overflow"] = body.configFlow.arrayList.arrayList_overflow;
result["@arrayList-bgColor"] = body.configFlow.arrayList.arrayList_bgColor;
result["@arrayList-borderColor"] = "@gray-lighter";
result["@arrayList-padding"] = body.configFlow.arrayList.arrayList_padding;
result["@arrayList-add-image"] = "@{base-path}/array-add.png";
result["@arrayList-remove-image"] = "@{base-path}/array-remove.png";

//ARRAYLIST HEADER VARIABLES
result["@arrayList-header-bgColor"] = body.configFlow.arrayListHeader.arrayList_header_bgColor;
result["@arrayList-header-fontSize"] = "@{font-size-base}!important";
result["@arrayList-header-fontWeight"] = body.configFlow.arrayListHeader.arrayList_header_fontWeight;
result["@arrayList-header-color"] = "@{gray-base}!important";

//ARRAYLIST INPUT VARIABLES
result["@arrayList-input-padding"] = "@input-padding";
result["@arrayList-input-fontSize"] = "@font-size-base";
result["@arrayList-input-borderRadius"] = "@input-borderRadius";
result["@arrayList-input-bgColor"] = "@gray-lighter";
result["@arrayList-input-color"] = "@gray-base";
result["@arrayList-input-minHeight"] = body.configFlow.arrayListInput.arrayList_input_minHeight;

//BUTTON VARIABLES
result["@button-color"] = "@primary-color";
result["@button-bgColor"] = "@alternate-color";
result["@button-hoverColor"] = "@button-color";
result["@button-hoverBgColor"] = "@button-bgColor";

//ALTERNATE BUTTON (NEXT) VARIABLES
result["@buttonNext-color"] = "@alternate-color";
result["@buttonNext-bgColor"] = "@primary-color";
result["@buttonNext-hoverColor"] = "@buttonNext-color";
result["@buttonNext-hoverBgColor"] = "darken(@buttonNext-bgColor, "+body.configFlow.alternateButton.buttonNext_hoverBgColor+")";
*/

//res.send(result);
});

		// Convert to JSON
		//var json = cssjson.toJSON(data);
		//json.attributes.background = body.background;
		//css = cssjson.toCSS(json);


	});


	//res.send("foi home");

	//es.send('okay');
	/*
	fs.writeFile("less/_variables.less", body.name, (err) => {
		if(err) throw err;
		console.log("Arquivo Salvo!");
	});
	*/
})

/*
//CSS Home
app.post('/api/1.0/homeCss', function(req, res){
	var body = req.body;
	console.log(body.name);
	res.send("foi home");
	fs.writeFile("nomeprojeto_home.css", body.name, (err) => {
		if(err) throw err;
		console.log("Arquivo Salvo!");
	});
})

//CSS Configuration Flow
app.post('/api/1.0/configCss', function(req, res){
	var body = req.body;
	console.log(body.name);
	res.send("foi config");
	fs.writeFile("nomeprojeto_configflow.css", body.name, (err) => {
		if(err) throw err;
		console.log("Arquivo Salvo!");
	});
})

//CSS Commerce
app.post('/api/1.0/commerceCss', function(req, res){
	var body = req.body;
	console.log(body.name);
	res.send("foi commerce");
	fs.writeFile("nomeprojeto_commerce.css", body.name, (err) => {
		if(err) throw err;
		console.log("Arquivo Salvo!");
	});
})

//cria um callback para a home (/)
app.get('/', function(req, res){
	res.send("Hello World!");
})

app.post('/api/test', function(req, res){
	var teste = req.body;
	console.log(teste.name);
	res.send("foi");
	fs.writeFile("teste.txt", teste.name);
})
*/

app.get('/test', function(req, res){
	res.send("Hello!");
})

//inicia o servidor na porta 3000
app.listen(3000, function(){
	console.log("Hello Server!");
})
