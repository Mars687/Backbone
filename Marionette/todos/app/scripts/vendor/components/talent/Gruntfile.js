module.exports = function( grunt ) {
	'use strict';
	//
	// Grunt configuration:
	//
	// https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
	//
	var grunt = require('./Grunt-Common.js')(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		,banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd H:MM") %> */'
		// default watch configuration
		,watch: {
			options: {
				livereload: false
			},
			jst: {
				files: [
					'app/templates/**/*.html'
				],
				tasks: 'jst'
			},
			talent: {
				files: ['src/**/*.js'],
				tasks: 'preprocess'
			}
		}
		,preprocess: {
			build: {
				src: [
					'src/talent.core.js'
				],
				dest: 'app/scripts/vendor/components/talent/index.js'
			}
			,dist: {
				src: [
					'src/talent.core.js'
				],
				dest: 'index.js'
			}
		}
		,connect: {
			server: {
				options: {
					hostname: '0.0.0.0'
					,port: 9000
					,base: 'app'
					,open: 'http://localhost:8000'
				}
			}
		}
		,requirejs: {
			main: {
				options: {
					baseUrl: "app/scripts",
					mainConfigFile: "app/scripts/config.js",
					out: "all-in-one.js",
					optimize: "none",
					preserveLicenseComments: false,
					keepBuildDir: true,
					removeCombined: false
					,include: [
						'requirejs'
						,'talent'
						,"backbone"
						,"$"
						,"json"
						,"marionette"
						,"_"
					]
				}
			}
		}
		,jst: {
			compile: {
				options: {
					prettify: true,
					// namespace: 'jst',
					processName: function(filename) {
						var index = filename.lastIndexOf('/');
						return filename.replace("app/templates/","").split(".")[0];
					},
					amd: true
				},
				files: {
					"app/scripts/templates/common.js": ["app/templates/common/**/*.html"]
					,"app/scripts/templates/home.js": ["app/templates/home/**/*.html"]
					,"app/scripts/templates/about.js": ["app/templates/about/**/*.html"]
				}
			}
		}
		,symlink: {
		    expanded: {
		        files: [{
		            expand: true,
		            overwrite: true,
		            cwd: 'hooks',
		            src: ['*'],
		            dest: '.git/hooks'
		        }]
		    },
		}
	});
	grunt.registerTask('hooks', ['symlink']);
	grunt.registerTask('js', ['jst']);
	grunt.registerTask('css', []);
	grunt.registerTask('local', ['jst','preprocess','watch']);
	grunt.registerTask('server', ['jst','preprocess','connect','watch']);

	// customized tasks by the project
	require('load-grunt-tasks')(grunt);
};
