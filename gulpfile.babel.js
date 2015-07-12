// generated on 2015-07-11 using generator-gulp-webapp 1.0.3
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import del from 'del'
import webpack from 'webpack-stream'
import { stream as wiredep } from 'wiredep'

const $ = gulpLoadPlugins()
const reload = browserSync.reload

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}))
})

function lint (files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
  }
}
const normalLintOptions = {
  extends: 'standard'
}

const testLintOptions = {
  configFile: '.eslintrc',
  env: {
    mocha: true
  }
}

gulp.task('lint', lint('app/scripts/**/*.js', normalLintOptions))
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions))

gulp.task('animated-sansa', () => {
  return gulp.src('app/scripts/animated-sansa/main.js')
    .pipe(webpack())
    .pipe($.rename('animated-sansa.js'))
    .pipe(gulp.dest('.tmp/scripts/'))
})

gulp.task('html', ['styles', 'animated-sansa'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']})

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'))
})

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
      .on('error', function (err) {
        console.log(err)
        this.end()
      })))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    '!app/Thumbs.db'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
})

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('serve', ['styles', 'fonts', 'animated-sansa'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  })

  gulp.watch([
    'app/*.html',
    'app/scripts/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*',
    '.tmp/scripts/*.js'
  ]).on('change', reload)

  gulp.watch('app/scripts/animated-sansa/**/*.js', ['animated-sansa'])
  gulp.watch('app/styles/**/*.scss', ['styles'])
  gulp.watch('app/fonts/**/*', ['fonts'])
  gulp.watch('bower.json', ['wiredep', 'fonts'])
})

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  })
})

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  })

  gulp.watch('test/spec/**/*.js').on('change', reload)
  gulp.watch('test/spec/**/*.js', ['lint:test'])
})

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'))

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'))
})

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}))
})

// FIXME: It fails even when the password is correct
gulp.task('deploy', ['build'], function () {
  // return gulp.src('dist')
  //   .pipe($.subtree())
  //   // .on('end', function () {
  //   //   del(['.tmp', 'dist'])
  //   // })

  // execute('git add ' + folder, function () {
  (function subtree (folder, cb) {
    var exec = require('child_process').exec
    var gutil = require('gulp-util')
    // var chalk = require('chalk')

    var remote = 'origin'
    var branch = 'gh-pages'
    var message = 'Distribution Commit'

    exec('git add -A ' + folder + ' && git commit -m "' + message + '"', function (error) {
      if (error) {
        // return cb(error)
        console.error(error)
        return
      }
      // gutil.log('Temporarily committing ' + chalk.magenta(folder))
      gutil.log('Temporarily committing ' + gutil.colors.magenta(folder))
      exec('git ls-remote ' + remote + ' ' + branch, function (error, rmt) {
        if (error) {
          // return cb(error);
          console.error(error)
          return
        }
        if (rmt.length > 0) {
          gutil.log('Cleaning ' + gutil.colors.cyan(remote) + '/' + gutil.colors.cyan(branch))
          exec('git push ' + remote + ' :' + branch, function (error) {
            if (error) {
              // return cb(error);
              console.error(error)
              return
            }
            deployFinish()
          })
        } else {
          deployFinish()
        }
      })
    })

    // ////////////////////////////
    // Finish Deploy
    // ////////////////////////////
    var deployFinish = function () {
      gutil.log('Pushing ' + gutil.colors.magenta(folder) + ' to ' + gutil.colors.cyan(remote) + '/' + gutil.colors.cyan(branch))
      exec('git subtree push --prefix ' + folder + ' ' + remote + ' ' + branch, function (error) {
        if (error) {
          // return cb(error);
          console.error(error)
          return
        }
        gutil.log('Resetting ' + gutil.colors.magenta(folder) + ' temporary commit')
        exec('git reset HEAD~1', function (error) {
          if (error) {
            // return cb(error);
            console.error(error)
            return
          }

        })
      })
    }
  })('dist', function (error) {
    if (error) {
      console.log(error)
      return
    }
    // ////////////////////////////
    // Delete files
    // ////////////////////////////
    del.call(null, ['.tmp', 'dist'])
  })
})

gulp.task('default', ['clean'], () => {
  gulp.start('build')
})
