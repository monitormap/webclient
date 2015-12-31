'use strict';

module.exports = function (grunt) {

	// Load grunt tasks automatically, when needed
	require('jit-grunt')(grunt, {
		useminPrepare: 'grunt-usemin',
		ngtemplates: 'grunt-angular-templates',
		cdnify: 'grunt-google-cdn',
		injector: 'grunt-asset-injector'
	});

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		pkg: grunt.file.readJSON('package.json'),
		open: {
			public: {
				url: 'http://localhost:8081'
			}
		},
		watch: {
			injectJS: {
				files: [
					'public/{app,directive}/**/*.js',
					'!public/app/app.js'],
				tasks: ['injector:scripts']
			},
			injectCss: {
				files: [
					'public/{app,directive}/**/*.css'
				],
				tasks: ['injector:css']
			},
			injectStylus: {
				files: [
					'public/{app,directive}/**/*.styl'],
				tasks: ['injector:stylus']
			},
			stylus: {
				files: [
					'public/{app,directive}/**/*.styl'],
				tasks: ['stylus', 'autoprefixer']
			},
			jade: {
				files: [
					'public/{app,directive}/*',
					'public/{app,directive}/**/*.jade'],
				tasks: ['jade']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				files: [
					'{.tmp,public}/{app,directive}/**/*.css',
					'{.tmp,public}/{app,directive}/**/*.html',
					'{.tmp,public}/{app,directive}/**/*.js',
					'!{.tmp,public}/translations.js',
					'public/img/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
				],
				options: {
					livereload: true
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: 'public/.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'public/{app,directive}/**/*.js',
				'!public/directive/rrd.js',
			]
		},

		// Empties folders to start fresh
		clean: {
			build: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'tmp',
						'build/*',
						'!build/.git*',
						'!build/.openshift',
						'!build/Procfile'
					]
				}]
			}
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			build: {
				files: [{
					expand: true,
					cwd: '.tmp/',
					src: '{,*/}*.css',
					dest: '.tmp/'
				}]
			}
		},

		// Automatically inject Bower directive into the app
		wiredep: {
			target: {
				src: 'public/index.html',
				ignorePath: 'public/',
				exclude: ['/json3/', '/es5-shim/' ]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: ['public/index.html'],
			options: {
				dest: 'build'
			}
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['build/{,*/}*.html'],
			css: ['build/{,*/}*.css'],
			js: ['build/{app,vendor}.js','build/*/*.js'],
			options: {
				assetsDirs: [
					'build',
					'build/img'
				],
				// This is so we update image references in our ng-templates
				patterns: {
					js: [
						[/(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
					]
				}
			}
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			build: {
				files: [{
					expand: true,
					cwd: 'public/img',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: 'build/img'
				}]
			}
		},

		svgmin: {
			build: {
				files: [{
					expand: true,
					cwd: 'public/img',
					src: '{,*/}*.svg',
					dest: 'build/img'
				}]
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngAnnotate: {
			build: {
				files: [{
					expand: true,
					cwd: '.tmp/concat',
					src: '*/**.js',
					dest: '.tmp/concat'
				}]
			}
		},

		// Package all the html partials into a single javascript payload
		ngtemplates: {
			options: {
				// This should be the name of your apps angular module
				module: 'monitormapApp',
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				},
				usemin: 'app/app.js'
			},
			main: {
				cwd: 'public',
				src: ['{app,directive}/**/*.html'],
				dest: '.tmp/templates.js'
			},
			tmp: {
				cwd: '.tmp',
				src: ['{app,directive}/**/*.html'],
				dest: '.tmp/tmp-templates.js'
			}
		},

		// Replace Google CDN references
		cdnify: {
			build: {
				html: ['build/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			build: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'public',
					dest: 'build',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						//'bower_components/**/*',
						'img/{,*/}*.{webp}',
						'fonts/**/*',
						'img/*.png',
						'index.html'
					]
				}, {
					expand: true,
					cwd: 'public/bower_components/semantic/dist/themes',
					dest: 'build/app/themes',
					src: [
						'**/assets/fonts/icons.*'
					]
				}, {
					expand: true,
					cwd: 'public/bower_components/leaflet-draw/dist/images',
					dest: 'build/app/images',
					src: [
						'*.*'
					]
				}, {
					expand: true,
					cwd: '.tmp/img',
					dest: 'build/img',
					src: ['generated/*']
				}]
			},
			styles: {
				expand: true,
				cwd: 'public',
				dest: '.tmp/',
				src: ['{app,directive}/**/*.css']
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			all: [
				'jade',
				'stylus',
				'imagemin',
				'svgmin'
			]
		},
		connect:{
			public:{
				options:{
					port:8081,
					hostname:'*',
					base:['.tmp','public']
				}
			},
			build:{
				options:{
					port:8081,
					hostname:'*',
					base:'build',
					keepalive: true
				}
			}
		},

		// Compiles Jade to html
		jade: {
			compile: {
				options: {
					data: {
						debug: false
					}
				},
				files: [{
					expand: true,
					cwd: 'public',
					src: [
						'{app,directive}/**/*.jade'
					],
					dest: '.tmp',
					ext: '.html'
				}]
			}
		},
		// Compiles Stylus to CSS
		stylus: {
			build: {
				options: {
					paths: [
						'public/bower_components',
						'public/app',
						'public/directive'
					],
					"include css": true
				},
				files: {
					'.tmp/app/app.css' : 'public/app/app.styl'
				}
			}
		},

		injector: {
			options: {

			},
			// Inject application script files into index.html (doesn't include bower)
			scripts: {
				options: {
					transform: function(filePath) {
						filePath = filePath.replace('/public/', '');
						filePath = filePath.replace('/.tmp/', '');
						return '<script src="' + filePath + '"></script>';
					},
					starttag: '<!-- injector:js -->',
					endtag: '<!-- endinjector -->'
				},
				files: {
					'public/index.html': [
							['{.tmp,public}/{app,directive}/**/*.js',
							 '!{.tmp,public}/app/app.js']
						]
				}
			},

			// Inject component styl into app.styl
			stylus: {
				options: {
					transform: function(filePath) {
						filePath = filePath.replace('/public/app/', '');
						filePath = filePath.replace('/public/directive/', '');
						return '@import \'' + filePath + '\';';
					},
					starttag: '// injector',
					endtag: '// endinjector'
				},
				files: {
					'public/app/app.styl': [
						'public/{app,directive}/**/*.styl',
						'!public/app/app.styl'
					]
				}
			},

			// Inject component css into index.html
			css: {
				options: {
					transform: function(filePath) {
						filePath = filePath.replace('/public/', '');
						filePath = filePath.replace('/.tmp/', '');
						return '<link rel="stylesheet" href="' + filePath + '">';
					},
					starttag: '<!-- injector:css -->',
					endtag: '<!-- endinjector -->'
				},
				files: {
					'public/index.html': [
						'public/{app,directive}/**/*.css'
					]
				}
			}
		},
		git_deploy: {
			build: {
				options: {
					url: 'git@github.com:monitormap/webclient.git',
					branch: 'build'
				},
				src: 'build'
			}
		}
	});

	grunt.registerTask('serve', [
		'clean:build',
		'injector:stylus',
		'concurrent:all',
		'injector',
		'wiredep',
		'autoprefixer',
		'connect:public',
		'open:public',
		'watch'
	]);

	grunt.registerTask('serve-build', [
		'open:public',
		'connect:build'
	]);

	grunt.registerTask('build', [
		'newer:jshint',
		'clean:build',
		'injector:stylus',
		'concurrent:all',
		'injector',
		'wiredep',
		'useminPrepare',
		'autoprefixer',
		'ngtemplates',
		'concat',
		'ngAnnotate',
		'copy:build',
		'cssmin',
		'uglify',
		'usemin'
	]);

	grunt.registerTask('release', [
		'build',
		'git_deploy:build'
	]);

	grunt.registerTask('default', [
		'serve'
	]);
};
