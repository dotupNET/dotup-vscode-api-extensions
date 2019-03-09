module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodemon: {
      dev: {
        script: './dist/sample.js'
      },
      options: {
        ignore: [
          'node_modules/**',
          'dist/**',
          'gruntfile.js'
        ],
        env: {
          PORT: '8181'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          '**/*.ts',
          '!node_modules/**/*.ts',
          '!dist/**/*.ts'
        ], // the watched files
        copy: {
          files: ['src/assets/**'],
          tasks: ['copy']
        },
        tasks: ["newer:tslint:all", "ts:build"], // the task to run
        options: {
          spawn: false // makes the watch task faster
        }
      }
    },

    concurrent: {
      watchers: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      all: {
        src: [
          "**/*.ts",
          "!src/dotup-sample-skill",
          "!dist/**/*.ts",
          "!node_modules/**/*.ts",
          "!obj/**/*.ts",
          "!typings/**/*.ts"
        ] // avoid linting typings files and node_modules files
      }
    },

    ts: {
      default: {
        tsconfig: './tsconfig.json'
      },
      options: {
        fast: 'never' // You'll need to recompile all the files each time for NodeJS
      }
    },

    copy: {
      assets: {
        cwd: 'src',
        // These are the directories to be copied as-is.
        // These must also be specified below in the watch block.
        src: ['assets/**'],
        dest: 'dist',
        expand: true
      }
    },

    run: {
      'test-jasmine': {
        cmd: 'npm.cmd',
        args: [
          'run',
          'test-jasmine'
        ]
      },
      'test-mocha': {
        cmd: 'npm.cmd',
        args: [
          'run',
          'test-mocha'
        ]
      },
      publish: {
        cmd: 'npm.cmd',
        args: [
          'run',
          'npm-publish'
        ]
      },
      ghpages: {
        cmd: 'npm.cmd',
        args: [
          'run',
          'gh-pages'
        ]
      }

    },

    clean: ['dist']

  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask("test-mocha", ["run:test-mocha"]);

  // Default tasks.
  grunt.registerTask("serve", ["concurrent:watchers"]);
  grunt.registerTask("build", ["clean", "ts", "copy:assets"]);
  //grunt.registerTask("release", ["clean", "ts", "tslint:all", "copy:assets"]);
  grunt.registerTask("pre-publish", ["clean", "ts", "run:test-mocha", "tslint:all", "copy:assets"]);
  grunt.registerTask("publish", ["pre-publish", "run:ghpages", "run:publish"]);

};
