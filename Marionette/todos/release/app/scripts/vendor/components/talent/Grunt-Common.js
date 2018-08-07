function  addTask( grunt ) {
	var componentName =  grunt.file.readJSON('package.json').name;
	
	//组件自身的图片和css移到app目录
	grunt.registerTask('sync', 'sync css and images', function(){
		var imageDestPath = 'app/scripts/vendor/components/'+ componentName + '/src/images';
	
		if(!grunt.file.exists('index.css')){
			return;
		}

		grunt.file.exists(imageDestPath) && grunt.file.delete(imageDestPath);

		grunt.file.copy('index.css', 'app/scripts/vendor/components/'+ componentName + '/index.css');
		
		if(grunt.file.isDir('src/images')){
			!grunt.file.isDir(imageDestPath) && grunt.file.mkdir(imageDestPath);
			grunt.file.recurse('src/images', function(all, dir,subdir, filename){
				var destPath = subdir ? imageDestPath +'/'+ subdir + '/' + filename : imageDestPath  + '/' + filename;
				grunt.file.copy(all, destPath);
			})
		}
	})

    //项目依赖的组件components目录的images和css移到项目自己的images和css目录中
	grunt.registerTask('publish', 'manage components css and images', function() {
		var dependencies = grunt.file.expand('app/scripts/vendor/components/*'), dependence, dependenceName,
			contents='', cssDestPath='app/styles/css/components', imagesDestPath='app/images/components', componentImagesDPath;
	
		grunt.file.isDir(cssDestPath) && grunt.file.delete(cssDestPath);
		grunt.file.isDir(imagesDestPath) && grunt.file.delete(imagesDestPath);

		for(var i = 0; i < dependencies.length; i++){
			dependence = dependencies[i];

			if(!grunt.file.exists(dependence + '/index.css')) continue;
			dependenceName = dependence.slice(dependence.lastIndexOf('/')+1);
			componentImagesDPath = 'app/images/components/' + dependenceName;

			grunt.log.writeln(dependence);

			contents += "@import url('../../../scripts/vendor/components/" + dependenceName +"/index.css');\n";
			
			var images = grunt.file.expand(dependence + '/src/images/*');
			if(images.length > 0) {
				!grunt.file.isDir(componentImagesDPath) && grunt.file.mkdir(componentImagesDPath);
				grunt.file.recurse(dependence + '/src/images', function(abspath, rootdir, subdir, filename){
					var destPath = subdir ? componentImagesDPath +'/'+ subdir + '/' + filename : componentImagesDPath  + '/' + filename;
					grunt.file.copy(abspath, destPath);
				})
			}
		}
		if(contents != ''){
			grunt.file.mkdir(cssDestPath);
			grunt.file.write(cssDestPath+'/index.css', contents);
		}
		grunt.log.writeln('css and images publish done!')
	});
	return grunt;
}
module.exports = addTask;


