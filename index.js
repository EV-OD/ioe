var list = []
// Parse the CSV file

let collegeElt = document.querySelector(".college")
function setCollege(value) {
  collegeElt.innerText = value
}

function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1);

  return rows.map((row) => {
    const data = row.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = data[index];
    });
    return obj;
  });
}

async function readCSV(path) {
  const response = await fetch(path);
  const csv = await response.text();
  const data = parseCSV(csv);
  return data
}

function addTo(subject, type, row) {
  if (checkAvailable(subject, type,row)) {
    list[subject][type].push(row)
    list[subject].count[type]++
    return true
  }
  return false
}
function checkAvailable(subject, type,student) {
  try {
    let x = 0;
    if(subject == "Agriculture"){
      let y = (list[subject].max[type] - x)
      console.log(y)
    }
    if(list[subject].female != undefined){
      x = list[subject].female[type]
    }
    if (list[subject].count[type] < (list[subject].max[type] - x)) {
      return true
    } else if (student.GENDER == "Female" || student.Gender == "Female") {
      if (list[subject].female) {
        return list[subject].femaleCount[type] <= list[subject].female[type]
      }
    }
  } catch (e) {
  }
}
function codeToSubject(code) {
  switch (code) {
    case 1:
      return { name: "Civil", type: "free" };
    case 2:
      return { name: "Civil", type: "full" };
    case 3:
      return { name: "Architecture", type: "free" };
    case 4:
      return { name: "Architecture", type: "full" };
    case 5:
      return { name: "Electrical", type: "free" };
    case 6:
      return { name: "Electrical", type: "full" };
    case 7:
      return { name: "Electronics", type: "free" };
    case 8:
      return { name: "Electronics", type: "full" };
    case 9:
      return { name: "Mechanical", type: "free" };
    case 10:
      return { name: "Mechanical", type: "full" };
    case 11:
      return { name: "Computer", type: "free" };
    case 12:
      return { name: "Computer", type: "full" };
    case 13:
      return { name: "Agriculture", type: "free" }
    case 14:
      return { name: "Agriculture", type: "full" }
    case 15:
      return { name: "Industrial", type: "free" }
    case 16:
      return { name: "Industrial", type: "full" }
    case 17:
      return { name: "Geomatics", type: "free" }
    case 18:
      return { name: "Geomatics", type: "full" }
    case 19:
      return { name: "Automobile", type: "free" }
    case 20:
      return { name: "Automobile", type: "full" }
    case 27:
      return { name: "Aerospace", type: "free" };
    case 28:
      return { name: "Aerospace", type: "full" };
    case 29:
      return { name: "Chemical", type: "free" };
    case 30:
      return { name: "Chemical", type: "full" };
    default:
      return { name: "Invalid subject code", type: "" };
  }
}

function scrollToTargetAdjusted(element, offset) {
  var elementPosition = element.getBoundingClientRect().top;
  var offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
}

function getTemplate(student) {
  return `
  <span class="rank">${student.Rank ? student.Rank : student.RANK}</span>
  <span>${student["Applicant Name"] ? student["Applicant Name"] : student["NAME"]}</span>
  <span style="background-color:white;padding-inline:10px;">${student.District ? student.District : student.DISTRICT}</span>
  `

}

let buttons = document.querySelectorAll("button")

async function handleCollege(college, elt) {
  const container = document.getElementById('container');
  container.innerHTML = ""
  setCollege(college)
  buttons.forEach(b => {
    b.classList.remove("active")
  })
  elt.classList.add("active")

  const data = await readCSV(`${college}.csv`);
  list = college_list[college]

  data.sort((a, b) => {
    return parseInt(a.Rank) - parseInt(b.Rank);
  });

  data.forEach((row) => {
    for (let i = 1; i <= 10; i++) {
      let p = row[`p${i}`] | row[`P${i}`]
      if (p != "p" && p != "P") {
        let subject = codeToSubject(parseInt(p))
        let x = addTo(subject.name, subject.type, row)
        if (x) {
          break
        }
      } else {
        break;
      }
    }
  })

  let p;
  // Iterate through the list object
  for (const subject in list) {
    // Get the current subject data
    const subjectData = list[subject];

    // Create a heading element for the subject
    const subjectHeading = document.createElement('h2');
    subjectHeading.textContent = subject;
    subjectHeading.classList.add(subject)

    // Append the subject heading to the container
    container.appendChild(subjectHeading);

    // Create a list element for the free students
    const freeList = document.createElement('ol');
    freeList.classList.add("free")

    // Iterate through the free students array
    p = document.createElement("p")
    p.innerHTML = "Regular"
    p.ariaLabel = subject
    container.appendChild(p)

    for (const student of subjectData.free) {
      // Create a list item element for the student
      const studentItem = document.createElement('li');

      studentItem.innerHTML = getTemplate(student)

      // Append the student item to the free list
      freeList.appendChild(studentItem);
    }

    // Append the free list to the container
    container.appendChild(freeList);
    p = document.createElement("p")
    p.innerHTML = "full fee"
    p.ariaLabel = subject
    container.appendChild(p)
    // Create a list element for the full students
    const fullList = document.createElement('ol');

    // Iterate through the full students array
    for (const student of subjectData.full) {
      // Create a list item element for the student
      const studentItem = document.createElement('li');
      studentItem.innerHTML = getTemplate(student)

      // Append the student item to the full list
      fullList.appendChild(studentItem);
      fullList.classList.add("full")
    }

    // Append the full list to the container
    container.appendChild(fullList);
  }
  let p_list = document.querySelectorAll("p")

  p_list.forEach(p => {
    p.onclick = (e) => {
      let t = p.nextSibling.classList.contains("opened")
      let ul_list = document.querySelectorAll("ol.opened")
      ul_list.forEach(ul => {
        ul.classList.remove("opened")
      })
      p_list.forEach(p_t => {
        p_t.classList.remove("opened_t")
      })
      if (!t) {
        collegeElt.innerHTML = college + ` (${p.ariaLabel}) `
        p.nextSibling.classList.add("opened")
        p.scrollIntoView()
        window.scrollBy(0, -30)
        p.classList.add("opened_t")
      } else {
        collegeElt.innerHTML = college
      }
    }
  })

}


