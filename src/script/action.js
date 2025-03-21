// before unload
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  event.returnValue = "";
});

document.addEventListener("DOMContentLoaded", () => {
  const importButton = document.getElementById("importButton");
  const saveButton = document.getElementById("saveButton");
  const exportButton = document.getElementById("exportButton");
  const fileName = document.getElementById("fileName");
  let page = document.getElementById("page");

  //==========================
  // Event import file
  //==========================
  importButton.addEventListener("click", () => {
    try {
      const inputFile = document.getElementById("input");

      // activate input file type
      inputFile.click();

      inputFile.addEventListener("change", (event) => {
        // get the first file of files which was choosen by user
        const file = event.target.files[0];
        if (!file) return;

        // set fileName
        fileName.value = file.name;

        // set contain
        const reader = new FileReader();
        reader.onload = function (e) {
          page.value = e.target.result;
          // Activate event input to count char and line
          page.dispatchEvent(new Event("input"));
        };

        reader.readAsText(file);
      });
    } catch (error) {
      alert("Error: " + error);
    }

    //==========================
    // Event save file
    //==========================
    saveButton.addEventListener("click", async () => {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName.value,
        });

        const writable = await fileHandle.createWritable();
        await writable.write(page.value);
        await writable.close();
      } catch (error) {
        alert("Error: " + error);
      }
    });
  });

  //==========================
  // Event export file
  //==========================
  exportButton.addEventListener("click", async () => {
    try {
      // Conver to tex
      const [mainContent, titlepageContent, prefContent] = mainProcess(
        page.value
      );

      // Create zip object
      let zip = new JSZip();

      // Create subfiles in zip
      const giftFolder = zip.folder(fileName.value + "project");
      giftFolder.file("content.tex", mainContent);
      giftFolder.file("references.bib", prefContent);
      giftFolder.file(
        "main.tex",
        `\\documentclass{set-up-page}

\\usepackage[backend=biber,style=ieee,sorting=none,style=numeric-comp]{biblatex}
\\addbibresource{references.bib}

\\begin{document}

\\coverpage

\\input{content}

\\setlength{\\parskip}{0pt}

\\end{document}
`
      );
      giftFolder.file(
        "set-up-page.cls",
        `
\\NeedsTeXFormat{LaTeX2e}

\\LoadClass[12pt, a4paper, fleqn]{article}

% Packages
\\RequirePackage[utf8]{vietnam}
\\RequirePackage{lmodern}
\\RequirePackage{graphicx}
\\RequirePackage{geometry}
\\RequirePackage{tikz}
\\usetikzlibrary{calc}
\\RequirePackage{ragged2e}
\\RequirePackage{setspace}
\\RequirePackage{datetime}
\\RequirePackage{scrextend}
\\RequirePackage{ifthen}
\\RequirePackage{hyperref}
\\RequirePackage{xstring}
\\usepackage{caption}
\\usepackage{float}
\\usepackage{fancyhdr}

\\usepackage{indentfirst}
\\setlength{\\parindent}{1cm}

\\fancyhf{}

% Margins configurations
\\geometry{
    a4paper,
    left=3.5cm,
    top=3cm,
    right=2cm,
    bottom=3.5cm
}

% Font size
\\newcommand{\\SetCustomFontSize}{\\changefontsizes{13pt}}
\\AtBeginDocument{\\SetCustomFontSize}

% Paragraph and Math Indentation
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\setlength{\\mathindent}{0pt}

% line spacing
\\AtBeginDocument{\\setstretch{1.5}}

\\usepackage{titlesec}

% Uncount section lv 1
\\newcommand{\\uncountSection}[1]{\\section*{#1} \\addcontentsline{toc}{section}{#1}
}

% Secsion lv 1
\\titlespacing*{\\section}{0pt}{0pt}{10pt}
\\titleformat{\\section}{\\fontsize{14pt}{0pt}\\bfseries \\centering}{}{0pt}{\\setcounter{subsection}{0} \\setcounter{subsubsection}{0} \\setcounter{paragraph}{0}}

\\newcommand{\\heading}[1]{
    \\section{#1}
}

% Secsion lv 2
\\titlespacing*{\\subsection}{0pt}{10pt}{0pt}
\\titleformat*{\\subsection}{\\fontsize{13pt}{0pt}\\bfseries}

\\newcommand{\\subheading}[1]{
    \\setcounter{subsubsection}{0} \\setcounter{paragraph}{0}
    \\subsection{#1}
}

% Secsion lv 3
\\titlespacing*{\\subsubsection}{0pt}{10pt}{0pt}
\\titleformat*{\\subsubsection}{\\fontsize{13pt}{0pt}\\bfseries \\itshape}

\\newcommand{\\subsubheading}[1]{
    \\subsubsection{#1}
}

% Table of contents configure
\\makeatletter
\\renewcommand{\\tableofcontents}{
    \\begingroup
    \\uncountSection{MỤC LỤC}
    \\renewcommand{\\contentsname}{}
    \\renewcommand{\\cfttoctitlefont}{}
    \\thispagestyle{empty}
    \\parindent 0pt
    \\@starttoc{toc}
    \\clearpage
    \\endgroup
}
\\makeatother

% Table of figures configure
\\makeatletter
\\renewcommand{\\listoffigures}{
    \\begingroup
    \\section*{DANH MỤC HÌNH ẢNH}
    \\thispagestyle{empty}
    \\parindent 0pt
    \\parskip 8pt
    \\@starttoc{lof}
    \\clearpage
    \\endgroup
}
\\makeatother

% Table of tables configure
\\makeatletter
\\renewcommand{\\listoftables}{
    \\begingroup
    \\section*{DANH MỤC BẢNG BIỂU}
    \\thispagestyle{empty}
    \\parindent 0pt
    \\parskip 8pt
    \\@starttoc{lot}
    \\clearpage
    \\endgroup
}
\\makeatother

% Figures configure
\\renewcommand{\\figurename}{\\fontsize{12pt}{0pt}\\selectfont \\bfseries Hình}
\\renewcommand{\\thefigure}{\\thesection.\\arabic{figure}}
\\captionsetup[figure]{labelsep=space}

% Tables configure
\\renewcommand{\\tablename}{\\fontsize{12pt}{0pt}\\selectfont \\bfseries Bảng}
\\renewcommand{\\thetable}{\\thesection.\\arabic{table}}
\\captionsetup[table]{labelsep=space}
` + titlepageContent
      );

      // Create zip file from it's object
      const blob = await zip.generateAsync({ type: "blob" });

      // Create a temporary link to download zip file
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName.value + "project.zip";

      // Click on the link
      document.body.appendChild(a);
      a.click();

      // Remove the link from the page
      document.body.removeChild(a);
    } catch (error) {
      alert("Error: " + error);
    }
  });
});
