const path = require('path');
const { dest } = require('gulp');
const { createProject } = require('gulp-typescript');

const { tsAbsoluteImports } = require('./utils/tsAbsoluteImports');

const tsProject = createProject(path.resolve(__dirname, '..', 'tsconfig.json'));

const code = (destination) => {
  const compileCode = () =>
    tsProject
      .src()
      .pipe(tsProject())
      .pipe(tsAbsoluteImports(destination, tsProject.config.compilerOptions))
      .pipe(dest(destination));

  return compileCode;
};

module.exports = {
  code,
};
