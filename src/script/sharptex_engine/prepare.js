const patterns = {
  key: /(?:#code|#ecode|#math|#emath|#cnts|#imgs|#tbs|#refs|#avoid|#break|#header|#footer|#ul|#cl|#tb|#titlepage-personal|titlepage-group|#book|#webpage|#thesis)/g,
  code: /#code\s*(.*?)\s*#ecode/gsu,
  math: /#math\s*(.*?)\s*#emath/gsu,
  url: /\b(?:https?|ftp):\/\/(?:www\.)?[a-zA-Z0-9\-._~%]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?/g,
  slash: /\\/g,
  percent: /%/g,
  and: /&/g,
  exp: /\^/g,
  underscore: /_/g,
  braceOpen: /\{/g,
  braceClose: /\}/g,
  approx: /~~/g,
  nEq: /<>/g,
  therefore: /=>/g,
  leq: /<=/g,
  geq: />=/g,
  arrowLeft: /<-/g,
  arrowRight: /->/g,
  greater: />/g,
  smaller: /</g,
  cnts: /#cnts/,
  imgs: /#imgs/,
  tbs: /#tbs/,
  refs: /#refs/,
  avoid: /#avoid/g,
  break: /#break/g,
  biu: /#(?:(?:biu)|(?:bui)|(?:ibu)|(?:iub)|(?:uib)|(?:ubi))[\t ]+(.*?)[\t ]*(?:$|#)/gmu,
  bi: /#(?:(?:bi)|(?:ib))[\t ]+(.*?)[\t ]*(?:$|#)/gmu,
  bu: /#(?:(?:bu)|(?:ub))[\t ]+(.*?)[\t ]*(?:$|#)/gmu,
  iu: /#(?:(?:iu)|(?:ui))[\t ]+(.*?)[\t ]*(?:$|#)/gmu,
  b: /#b\s+(.*?)[\t ]*(?:$|#)/gmu,
  u: /#u\s+(.*?)[\t ]*(?:$|#)/gmu,
  i: /#i\s+(.*?)[\t ]*(?:$|#)/gmu,
  uh: /#uh[\t ]*([^\n]*)/gu,
  h1: /#h1[\t ]*([^\n]*)/gu,
  h2: /#h2[\t ]*([^\n]*)/gu,
  h3: /#h3[\t ]*([^\n]*)/gu,
  c: /#c\s+([^\n]*)/gu,
  r: /#r\s+([^\n]*)/gu,
  imgc: /#img\s*\$\s*(.*?)\s*\$\s*(.*?)\s*(?:$|#)/gmu,
  img: /#img\s*\$\s*(.*?)\s*(?:$|#)/gmu,
  header: /#header\s*\$\s*(.*?)\s*\$\s*(.*?)\s*\$\s*(.*?)\s*(?:$|#)/gmu,
  footer: /#footer\s*\$\s*(.*?)\s*\$\s*(.*?)\s*\$\s*(.*?)\s*(?:$|#)/gu,
  ul: /#ul\s*\n(.*?)\n#/gsu,
  cl: /#cl\s*\n(.*?)\n#/gsu,
  tbc: /#tb\s*\n(.*?)\n\$(.*?)\n*#/gsu,
  tb: /#tb\s*\n(.*?)\n#/gsu,
  titlepagePersonal:
    /#titlepage-personal\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/su,
  titlepageGroup:
    /#titlepage-group\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/su,
  book: /#book\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#*/gsu,
  webpage: /#webpage\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#*/gsu,
  thesis: /#thesis\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#*/gsu,
};

function cloneRegex(regex) {
  return new RegExp(regex, regex.flags);
}
