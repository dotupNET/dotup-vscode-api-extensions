module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask("test-mocha", ["run:test-mocha"]);

  // Default tasks.
  grunt.registerTask("ts:lint", "tslint:all");
  grunt.registerTask("ts:build", ["clean", "ts", "copy:assets"]);
  //grunt.registerTask("release", ["clean", "ts", "tslint:all", "copy:assets"]);
  grunt.registerTask("pre-publish", ["clean", "ts", "run:test-mocha", "tslint:all", "copy:assets"]);
  grunt.registerTask("publish", ["pre-publish", "run:ghpages", "run:publish"]);
  grunt.registerTask("publish-fast", ["pre-publish", "run:publish"]);

};
