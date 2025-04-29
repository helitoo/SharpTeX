// before unload
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  event.returnValue = "";
});

document.addEventListener("DOMContentLoaded", () => {
  const importButton = document.getElementById("importButton");
  const saveButton = document.getElementById("saveButton");
  const exportButton = document.getElementById("exportButton");
  const convertButton = document.getElementById("convertButton");
  const fileName = document.getElementById("fileName");

  //==========================
  // Event import file
  //==========================
  importButton.addEventListener("click", () => {
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
        toPage(e.target.result);
        // Activate event input to count char and line
        // page.dispatchEvent(new Event("input"));
      };

      reader.readAsText(file);
    });
  });

  //==========================
  // Event save file
  //==========================
  async function saveAs(name, content) {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: name,
    });

    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  function download(name, blob) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  saveButton.addEventListener("click", async () => {
    if (window.showSaveFilePicker) {
      saveAs(fileName.value, getText(page.state.doc));
    } else {
      download(
        fileName.value,
        new Blob([getText(page.state.doc)], { type: "text/plain" })
      );
    }
  });

  //==========================
  // Event convert file
  //==========================
  convertButton.addEventListener("click", () => {
    const [mainContent, titlepageContent, prefContent] = mainProcess(
      getText(page.state.doc)
    );
    navigator.clipboard
      .writeText(mainContent)
      .then(() => {
        alert("Đã copy vào clipboard!");
      })
      .catch((err) => {
        alert(err);
      });
  });

  //==========================
  // Event export file
  //==========================
  exportButton.addEventListener("click", async () => {
    try {
      // Conver to tex
      const [mainContent, titlepageContent, prefContent] = mainProcess(
        getText(page.state.doc)
      );

      // Create zip object
      let zip = new JSZip();

      // Create subfiles in zip
      const giftFolder = zip.folder(fileName.value + ".project");
      giftFolder.file("content.tex", mainContent);
      giftFolder.file("references.bib", prefContent);
      giftFolder.file(
        "main.tex",
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
        \\usepackage{tabularx}
        \\usepackage{csquotes}
        \\usepackage{setspace}
        \\usepackage{mdframed}
        \\usepackage{multirow}
        \\usepackage{booktabs}
        \\usepackage{enumitem}
        \\usepackage{makecell}
        
        \\usepackage{enumitem}
        \\setlist{itemsep=0pt, topsep=0pt}
        \\usepackage{enumitem}
        \\setlist[itemize]{leftmargin=5em}
        
        \\usepackage{indentfirst}
        \\setlength{\\parindent}{1cm}
        \\setlength{\\parskip}{0.3cm}
        
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
        
        % line spacing
        \\AtBeginDocument{\\setstretch{1.5}}
        
        \\usepackage{titlesec}
        
        % Pseudo section lv 1
        \\newcommand{\\pseudoHeading}[1]{
            \\clearpage
            \\thispagestyle{empty}
            \\begin{center}
                \\textbf{#1}
            \\end{center}
        }
        
        % Uncount section lv 1
        \\newcommand{\\uncountHeading}[1]{
            \\clearpage
            \\thispagestyle{empty}
            \\section*{#1}
            \\addcontentsline{toc}{section}{#1}
        }
        
        % Secsion lv 1
        \\setcounter{section}{0}
        
        \\titlespacing*{\\section}{0pt}{0pt}{10pt}
        \\titleformat{\\section}{\\fontsize{14pt}{0pt}\\bfseries \\centering}{}{0pt}{\\setcounter{subsection}{0} \\setcounter{subsubsection}{0}}
        
        \\newcommand{\\heading}[1]{
            \\clearpage
            \\vspace*{0.05cm}
            \\stepcounter{section}
            \\section*{#1}
            \\addcontentsline{toc}{section}{#1}
        }
        
        % Secsion lv 2
        \\titlespacing*{\\subsection}{0pt}{10pt}{0pt}
        \\titleformat*{\\subsection}{\\fontsize{14pt}{0pt}\\bfseries}
        
        \\newcommand{\\subheading}[1]{
            \\setcounter{subsubsection}{0}
            \\subsection{#1}
        }
        
        % Secsion lv 3
        \\titlespacing*{\\subsubsection}{0pt}{10pt}{0pt}
        \\titleformat*{\\subsubsection}{\\fontsize{13pt}{0pt}\\bfseries \\itshape}
        
        \\newcommand{\\subsubheading}[1]{
            \\subsubsection{#1}
        }
        
        % Table of contents
        \\makeatletter
        \\renewcommand{\\tableofcontents}{
            \\begingroup
            \\pagenumbering{arabic}
            \\setcounter{page}{0}
            \\uncountHeading{MỤC LỤC}
            \\renewcommand{\\contentsname}{}
            \\thispagestyle{empty}
            \\parindent 0pt
            \\parskip -0.8pt
            \\@starttoc{toc}
            \\clearpage
            \\endgroup
        }
        \\makeatother
        
        % Table of figures configure
        \\makeatletter
        \\renewcommand{\\listoffigures}{
            \\begingroup
            \\uncountHeading{DANH MỤC HÌNH ẢNH}
            \\thispagestyle{empty}
            \\parindent 0pt
            \\parskip 0pt
            \\@starttoc{lof}
            \\clearpage
            \\endgroup
        }
        \\makeatother
        
        % Table of tables configure
        \\makeatletter
        \\renewcommand{\\listoftables}{
            \\begingroup
            \\uncountHeading{DANH MỤC BẢNG BIỂU}
            \\thispagestyle{empty}
            \\parindent 0pt
            \\parskip 0pt
            \\@starttoc{lot}
            \\clearpage
            \\endgroup
        }
        \\makeatother
        
        % Table of tables references
        \\newcommand{\\refs}{
          \\uncountHeading{TÀI LIỆU THAM KHẢO}
          \\thispagestyle{empty}
          \\nocite{*}
          \\printbibliography[heading=none]
        }
        
        \\usepackage{chngcntr}
        \\counterwithin{figure}{section}
        \\counterwithin{table}{section}
        
        % Figures configure
        \\renewcommand{\\figurename}{\\fontsize{12pt}{0pt}\\selectfont \\bfseries Hình}
        \\renewcommand{\\thefigure}{\\thesection.\\arabic{figure}}
        \\captionsetup[figure]{labelsep=space}
        
        % Tables configure
        \\renewcommand{\\tablename}{\\fontsize{12pt}{0pt}\\selectfont \\bfseries Bảng}
        \\renewcommand{\\thetable}{\\thesection.\\arabic{table}}
        \\captionsetup[table]{labelsep=space}
        
        \\newcommand{\\cmt}{
        \\pseudoHeading{NHẬN XÉT CỦA GIẢNG VIÊN}
        
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        \\noindent.............................................................................................................................\\\\
        
        \\begin{flushright}
        \\begin{minipage}{0.7\\textwidth}
        \\centering
        .............................., ngày ...., tháng ...., năm .........\\\\
        Giảng viên\\\\
        (\\textit{Ký và ghi rõ họ tên})
        \\end{minipage}
        \\end{flushright}
        }
        

` + titlepageContent
      );

      download(
        fileName.value + "-project.zip",
        await zip.generateAsync({ type: "blob" })
      );
    } catch (error) {
      alert("Error: " + error);
    }
  });
});
