//////////////////////////////////////////////
//  Normal format
//////////////////////////////////////////////

function replaceRepropcess(content) {
  content = content.replace(/%/g, "\\% ");
  content = content.replace(/&/g, "\\& ");
  content = content.replace(/\^/g, "\\^ ");
  content = content.replace(/_/g, "\\_ ");
  content = content.replace(/\{/g, "\\{ ");
  content = content.replace(/\}/g, "\\} ");
  content = content.replace(/~/g, "\\~{} ");
  content = content.replace(/<>/g, "$\\neq$");
  content = content.replace(/=>/g, "$\\Rightarrow$");
  content = content.replace(/<=/g, "$\\leq$");
  content = content.replace(/>=/g, "$\\geq$");
  content = content.replace(/<-/g, "$\\leftarrow$");
  content = content.replace(/->/g, "$\\rightarrow$");
  content = content.replace(/>/g, "\\textgreater{} ");
  content = content.replace(/</g, "\\textless{} ");
  return content;
}

function replaceSymbolsHashtag(content) {
  content = content.replace(/#cnts/, "\\tableofcontents");
  content = content.replace(/#imgs/, "\\listoffigures");
  content = content.replace(/#tbs/, "\\tableofcontents");
  content = content.replace(/#refs/, "\\nocite{*}\n\\printbibliography");
  content = content.replace(/#avoid/g, "\\thispagestyle{empty}");
  content = content.replace(/#break/g, "\\cleardoublepage");
  return content;
}

function replaceLayoutHashtag(content) {
  content = content.replace(/#uh\s+(.*)#/gu, (match, content) => {
    return `\\uncountSection{${content}}`;
  });

  content = content.replace(/#h1\s+(.*)#/gu, (match, content) => {
    return `\\heading{${content}}`;
  });

  content = content.replace(/#h2\s+(.*)#/gu, (match, content) => {
    return `\\subheading{${content}}`;
  });

  content = content.replace(/#h3\s+(.*)#/gu, (match, content) => {
    return `\\subsubheading{${content}}`;
  });

  content = content.replace(/#b\s+(.*)#/gu, (match, content) => {
    return `\\textbf{${content}}`;
  });

  content = content.replace(/#u\s+(.*)#/gu, (match, content) => {
    return `\\underline{${content}}`;
  });

  content = content.replace(/#i\s+(.*)#/gu, (match, content) => {
    return `\\textit{${content}}`;
  });

  content = content.replace(
    /#(?:(?:bi)|(?:ib))\s+(.*?)#/gu,
    (match, content) => {
      return `\\textbf{\\textit{${content}}}`;
    }
  );

  content = content.replace(
    /#(?:(?:bu)|(?:ub))\s+(.*?)#/gu,
    (match, content) => {
      return `\\textbf{\\underline{${content}}}`;
    }
  );

  content = content.replace(
    /#(?:(?:iu)|(?:ui))\s+(.*?)#/gu,
    (match, content) => {
      return `\\textit{\\underline{${content}}}`;
    }
  );

  content = content.replace(
    /#(?:(?:biu)|(?:bui)|(?:ibu)|(?:iub)|(?:uib)|(?:ubi))\s+(.*?)#/gu,
    (match, content) => {
      return `\\textbf{\\textit{\\underline{${content}}}}`;
    }
  );

  content = content.replace(/#c\s+(.*)#/gu, (match, content) => {
    return `\\begin{center} ${content} \\end{center}`;
  });

  content = content.replace(
    /#img\s*\n\$(.*?)\n\$(.*?)\n#?/gu,
    (match, link, caption) => {
      return `\\begin{figure}[H]
    \\centering
    \\includegraphics[width=0.5\\textwidth]{${link}}
    \\caption{\\fontsize{12pt}{0pt}\\selectfont{${caption}}}
\\end{figure}`;
    }
  );

  content = content.replace(/#img\s*\n\$(.*?)\n#?/gu, (match, link) => {
    return `\\begin{figure}[H]
    \\centering
    \\includegraphics[width=0.5\\textwidth]{${link}}
\\end{figure}`;
  });

  content = content.replace(
    /#header\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gu,
    (match, left, right, center) => {
      return `\\pagestyle{fancy}
\\fancyhead[L]{${left}}
\\fancyhead[C]{${center}}
\\fancyhead[R]{${right}}
\\renewcommand{\\headrulewidth}{0.4pt}`;
    }
  );

  content = content.replace(
    /#footer\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gu,
    (match, left, right, center) => {
      return `\\pagestyle{fancy}
\\fancyfoot[L]{${left}}
\\fancyfoot[C]{${center}}
\\fancyfoot[R]{${right}}
\\renewcommand{\\headrulewidth}{0.4pt}`;
    }
  );

  return content;
}

function replaceListHashtag(content) {
  function coreProcess(content, typeOfList) {
    let lines = content.split("\n");
    let bodies = []; // Get each lines after remove $
    let levels = []; // Get number of $ on each line

    for (let line of lines) {
      levels.push([...line.matchAll(/\$/g)].length);
      bodies.push(line.replace(/\$/g, ""));
    }

    let count = 1;
    let result = `\\begin{${typeOfList}}\n`;

    for (let i = 0; i < lines.length; i++) {
      if (i > 0 && levels[i] > levels[i - 1]) {
        result += `\\begin{${typeOfList}}\n\\item{${bodies[i]}}`;
        count++;
      } else if (i > 0 && levels[i] < levels[i - 1]) {
        result += `\\end{${typeOfList}}\n`.repeat(levels[i - 1] - levels[i]);
        result += `\\item{${bodies[i]}}\n`;
        count -= levels[i - 1] - levels[i];
      } else {
        result += `\\item{${bodies[i]}}\n`;
      }
    }
    result += `\\end{${typeOfList}}`.repeat(count);
    return result;
  }

  content = content.replace(/#ul\s*\n(.*?)\n#/gsu, (match, content) =>
    coreProcess(content, "itemize")
  );

  content = content.replace(/#cl\s*\n(.*?)\n#/gsu, (match, content) =>
    coreProcess(content, "enumerate")
  );
  return content;
}

function replaceTableHashtag(content) {
  function getTable(match, content, caption) {
    // Make declaration
    let lines = content.split("\n");
    let result =
      "\\begin{table}[H]\n\\centering\n\\begin{tabularx}{\\textwidth}{|";
    for (let i = 0; i < lines[0].split(";").length; i++) {
      result += "X|";
    }
    result += "}\n\\hline\n";

    // Make header
    let headerCells = lines[0].split(";");
    let l = headerCells.length;
    for (let i = 0; i < l; i++) {
      if (i == 0) {
        result += `\\multicolumn{1}{|c|}{\\textbf{${headerCells[i]}}}`;
      } else {
        result += `&\\multicolumn{1}{c|}{\\textbf{${headerCells[i]}}}`;
      }
    }
    result += "\\\\\n\\hline\n";

    // Make body
    l = lines.length;
    for (let i = 1; i < l; i++) {
      result += lines[i].split(";").join("&") + "\\\\\n\\hline\n";
    }

    // Make footer
    result += `\\end{tabularx}\n${caption}\\end{table}`;

    return result;
  }

  content = content.replace(/#tb\s*\n(.*?)\n#/gsu, (match, content) =>
    getTable(match, content, "")
  );

  content = content.replace(
    /#tb\s*\n(.*?)\n\$(.*?)\n?#/gsu,
    (match, content, caption) =>
      getTable(match, content, `\\caption[${caption}]{${caption}}\n`)
  );

  return content;
}

function replaceTitlepageHashtag(content) {
  const regexPersonal =
    /#titlepage-personal\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/su;
  const regexGroup =
    /#titlepage-group\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/su;

  if (regexPersonal.test(content)) {
    let titlepageContent = content.match(regexPersonal)[0];
    content = content.replace(regexPersonal, "");
    titlepageContent = titlepageContent.replace(
      regexPersonal,
      (
        match,
        school,
        logo,
        thesis,
        topic,
        instructor,
        student,
        studentID,
        classID,
        place
      ) => {
        return `\\newcommand{\\coverpage}{
      \\begin{titlepage}
          \\begin{tikzpicture}[overlay, remember picture]
          \\draw [line width=3pt]
          ($ (current page.north west) + (3.0cm, -2.0cm) $)
          rectangle
          ($ (current page.south east) + (-2.0cm, 2.5cm) $);
          \\draw [line width=0.5pt]
          ($ (current page.north west) + (3.1cm, -2.1cm) $)
          rectangle
          ($ (current page.south east) + (-2.1cm, 2.6cm) $);
          \\end{tikzpicture}
  
      \\centering
      \\textbf{${school}}\\\\
      
      \\vspace{1cm}
      \\includegraphics[width=0.2\\textwidth]{${logo}}\\\\
      \\vspace{1cm}
      \\Large
      \\textbf{${thesis}}\\\\
  
      \\begin{center}
      Đề tài\\\\
          \\begin{minipage}[c][3\\baselineskip][c]{0.8\\textwidth}
              \\centering \\textbf{${topic}}
          \\end{minipage}
      \\end{center}
  
      \\justifying \\normalsize  
      \\begin{table}[h]
          \\centering
          \\renewcommand{\\arraystretch}{1.5}
          \\begin{tabular}{l l}
              \\textbf{\\textit{Giảng viên hướng dẫn:}}&${instructor}\\\\
              \\textbf{\\textit{Sinh viên thực hiện:}}&${student}\\\\
              \\textbf{\\textit{MSSV:}}&${studentID}\\\\
              \\textbf{\\textit{Mã lớp:}}&${classID}\\\\
          \\end{tabular}
      \\end{table}
  
      \\vfill
      \\begin{center}
          \\textbf{${place}}
      \\end{center}
  \\end{titlepage}
  \\newpage
  \\thispagestyle{empty}
  }
\\endinput
`;
      }
    );

    return [titlepageContent, content];
  }

  if (regexGroup.test(content)) {
    let [
      titlepageContent,
      school,
      logo,
      thesis,
      topic,
      instructor,
      classID,
      group,
      place,
    ] = content.match(regexGroup);
    content = content.replace(regexGroup, "");

    // Convert table

    let convertedTable = "";
    let lines = group.split("\n");
    group = lines[0]; // Now the variable group contains the name of group

    for (let i = 1; i < lines.length; i++) {
      convertedTable += lines[i].split(";").join("&");
      convertedTable += "\\\\\n";
    }

    titlepageContent = titlepageContent.replace(
      regexGroup,
      `\\newcommand{\\coverpage}{
      \\begin{titlepage}
          \\begin{tikzpicture}[overlay, remember picture]
          \\draw [line width=3pt]
          ($ (current page.north west) + (3.0cm, -2.0cm) $)
          rectangle
          ($ (current page.south east) + (-2.0cm, 2.5cm) $);
          \\draw [line width=0.5pt]
          ($ (current page.north west) + (3.1cm, -2.1cm) $)
          rectangle
          ($ (current page.south east) + (-2.1cm, 2.6cm) $);
          \\end{tikzpicture}
  
      \\centering
      \\textbf{${school}}\\\\
      
      \\vspace{1cm}
      \\includegraphics[width=0.2\\textwidth]{${logo}}\\\\
      \\vspace{1cm}
      \\Large
      \\textbf{${thesis}}\\\\
  
      \\begin{center}
      Đề tài\\\\
          \\begin{minipage}[c][3\\baselineskip][c]{0.8\\textwidth}
              \\centering \\textbf{${topic}}
          \\end{minipage}
      \\end{center}
      \\vspace{-0.7cm}
      \\justifying \\normalsize  
      \\begin{table}[h]
          \\centering
          \\begin{tabular}{l l}
              \\textbf{\\textit{Giảng viên hướng dẫn:}}&${instructor}\\\\
              \\textbf{\\textit{Mã lớp:}}&${classID}\\\\
              \\textbf{\\textit{Nhóm sinh viên thực hiện:}}&${group}\\\\
          \\end{tabular}
      \\end{table}
      \\vspace{-0.8cm}
      \\begin{table}[h]
          \\centering
          \\begin{tabular}{l l l}
              ${convertedTable}
          \\end{tabular}
      \\end{table}
      \\vfill
      \\begin{center}
          \\textbf{${place}}
      \\end{center}
  \\end{titlepage}
  \\newpage
  \\thispagestyle{empty}
  }
\\endinput
`
    );

    return [titlepageContent, content];
  }

  return ["", content]; // The case that has no any titlepage
}

function replaceRefHashtag(content) {
  let prefContent = "";
  const bookRegex = /#book\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gsu;
  const webpageRegex =
    /#webpage\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gsu;
  const thesisRegex =
    /#thesis\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gsu;

  if (bookRegex.test(content)) {
    bookRegex.lastIndex = 0;
    prefContent += content.match(bookRegex).join("\n");
    bookRegex.lastIndex = 0;
    content = content.replace(bookRegex, "");
  }

  if (webpageRegex.test(content)) {
    webpageRegex.lastIndex = 0;
    prefContent += content.match(webpageRegex).join("\n");
    webpageRegex.lastIndex = 0;
    content = content.replace(webpageRegex, "");
  }

  if (thesisRegex.test(content)) {
    thesisRegex.lastIndex = 0;
    prefContent += content.match(thesisRegex).join("\n");
    thesisRegex.lastIndex = 0;
    content = content.replace(thesisRegex, "");
  }

  bookRegex.lastIndex = 0;
  webpageRegex.lastIndex = 0;
  thesisRegex.lastIndex = 0;

  prefContent = prefContent.replace(
    bookRegex,
    (match, author, title, year, publisher) => {
      return `@book{${crypto.randomUUID()},,
  author    = {${author}},
  title     = {${title}},
  year      = {${year}},
  publisher = {${publisher}}
}
`;
    }
  );

  prefContent = prefContent.replace(
    webpageRegex,
    (match, author, title, year, note, link) => {
      return `@misc{${crypto.randomUUID()},,
  author    = {${author}},
  title     = {${title}},
  year      = {${year}},
  url       = {${link}},
  note      = {Truy cập ngày ${note}}
}
`;
    }
  );

  prefContent = prefContent.replace(
    thesisRegex,
    (match, author, title, year, type, school) => {
      type = type.trim().toLowerCase();
      if (type == "mastersthesis") {
        return `@mastersthesis{${crypto.randomUUID()},,
  author    = {${author}},
  title     = {${title}},
  school    = {${school}},
  year      = {${year}}
}
`;
      } else {
        return `@phdthesis{${crypto.randomUUID()},
  author    = {${author}},
  title     = {${title}},
  school    = {${school}},
  year      = {${year}}
}
`;
      }
    }
  );

  return [prefContent, content];
}

//////////////////////////////////////////////
//  Main
//////////////////////////////////////////////

function mainProcess(content) {
  // Get main content
  let mainContent = String(content),
    titlepageContent,
    prefContent;

  // Hiding environments
  const codeMatches = [
    ...mainContent.matchAll(/#code\s*\n*(.*?)\n*#ecode/gsu),
  ].map((match) => match[1]);
  mainContent = mainContent.replace(/#code\s*\n*(.*?)\n*#ecode/gsu, "@code");

  mainContent = replaceRepropcess(mainContent);

  [titlepageContent, mainContent] = replaceTitlepageHashtag(mainContent);
  [prefContent, mainContent] = replaceRefHashtag(mainContent);

  const mathMatches = [
    ...mainContent.matchAll(/#math\n*(.*?)\n*#emath/gsu),
  ].map((match) => match[1]);
  mainContent = mainContent.replace(/#math\n*(.*?)\n*#emath/gsu, "@math");

  mainContent = mainContent.replace(/\\#/g, "@sharp");
  mainContent = mainContent.replace(/\\\$/g, "@dolar");
  mainContent = mainContent.replace(/\\;/g, "@semicolon");

  // Replace some specific hashtags

  mainContent = replaceSymbolsHashtag(mainContent);
  mainContent = replaceLayoutHashtag(mainContent);
  mainContent = replaceListHashtag(mainContent);
  mainContent = replaceTableHashtag(mainContent);

  // Restore environments

  mainContent = mainContent.replace(/@sharp/g, "\\# ");
  mainContent = mainContent.replace(/@dolar/g, "\\$ ");
  mainContent = mainContent.replace(/@semicolon/g, ";");

  if (mathMatches) {
    for (let match of mathMatches) {
      mainContent = mainContent.replace(/@math/, match);
    }
  }

  if (codeMatches) {
    for (let match of codeMatches) {
      mainContent = mainContent.replace(
        /@code/,
        "\\ttfamily\n\\begin{verbatim}\n" +
          match +
          "\n\\end{verbatim}\n\\normalfont"
      );
    }
  }

  return [mainContent, titlepageContent, prefContent];
}
