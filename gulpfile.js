const {join} = require('path')

const gulp = require('gulp')
const typescript = require('gulp-typescript')
const merge = require('merge2')

const tsproj = typescript.createProject(join(__dirname, 'tsconfig.json'))

gulp.task('default', ['build'])

gulp.task('build', () => {
    const {js, dts} = tsproj.src().pipe(tsproj())
    return merge([
        js.pipe(gulp.dest('dist')),
        dts.pipe(gulp.dest('dist')),
    ])
})

gulp.task('watch', ['build'], () => {
    gulp.watch(['src/**/*.ts', 'tsconfig.json'],
               ['build'])
})