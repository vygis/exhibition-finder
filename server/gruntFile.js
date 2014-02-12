/*global module*/

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    nodeunit: ['test/**/*.js'],
    watch: {
      files: '<config:lint.files>',
      tasks: 'default timestamp'
    },
    shell: {
      mongod: {
          command: 'mongod'
      },
      server: {
          command: 'node server.js'
      }
    },
    jshint: {
      files: ['gruntFile.js', 'server.js', 'lib/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        globals: { require: false, __dirname: false, console: false, module: false, exports: false }
      }
    },

    concurrent: {
      options: {
          logConcurrentOutput: true
      },
      tasks: ['shell:mongod', 'shell:server']

    }
  });

  // Default task.

  grunt.registerTask('default', ['launch']);

  grunt.registerTask('launch', ['concurrent']);

  grunt.registerTask('build', ['jshint','nodeunit']);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

//  grunt.registerTask('supervise', function() {
//    this.async();
//    require('supervisor').run(['server.js']);
//  });
};
