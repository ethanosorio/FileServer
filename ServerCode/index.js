let select = document.getElementById('files');
let text = document.getElementById('filetxt');
let filename = document.getElementById('filename');
let root = 'http://localhost:8000';
let savefile = document.querySelector('#save');
let deletefile = document.querySelector('#delete');
let dirname = document.getElementById('dirname');
let publish = document.getElementById('publishDirectory');

//----------------------------------------------------
// populates the select bar with the files in the directory
const diraddress = fetch(`${root}/`)      //Get request to get file content
  .then((response) => response.text())
  .then((response) => {return response;});
const loadDir = async () => {
  let pathway = await diraddress;     
  document.getElementById('dir').innerHTML = pathway;     //lists the files in the directory
  const array = pathway.split('\n');          //stores each file name in an array
  select.innerHTML = '';
  let choose = document.createElement('option');
  choose.innerHTML = "Choose file";           //makes the select dropdown say "choose file"
  choose.value = '';
  select.appendChild(choose);
  array.forEach((file, index) => {            //adds each file name to the select drop down menu
    let option = document.createElement('option');
    option.innerHTML = file;
    select.appendChild(option);             //creates each option and appends it to the select menu
    if (file === filename.value) select.selectedIndex = index + 1;
  });
};
loadDir();        //calls the function to load the values of the directory into the select menu

//----------------------------------------------------
//loads the file once one is selected
select.addEventListener('change', event => {        //adds an event listener to the select menu to load the selected file
  if (select.value) {                   //if there is a selected value then it fetches the file content
    filename.value = select.value;        //displays the selected file name
    fetch(`${root}/${select.value}`)      //fetchese the content
      .then(response => {
        return response.text();
      })
      .then(textcontent => {              //displays the files in the text area
        text.innerHTML = textcontent;
      })
      .then(loadDir);                 //reloads the directory
  } else {
    filename.value = '';                //clears the text area if no file is selected
    text.innerHTML = '';
  }
});

//---------------------------------------------------------
//saves the document with a PUT request
function saveSubmit(event) {
  event.preventDefault();
  fetch(`${root}/${filename.value}`, {        //creates a put request to the current selected file 
    method: "PUT",
    body: text.value                    //Puts the text onto the file
  }).then(loadDir);
  location.reload();              //refreshes the page to update the directory on the page
}
savefile.addEventListener('click', saveSubmit);         //adds click listener

//-----------------------------------------------------------
//deletes the document with DELETE request
function deleteSubmit(event) {
  if (filename.value) {                   //if the file if open then it can delete otherwise nothing happens
    fetch(`${root}/${filename.value}`, {          //makes a DELETE request to the selected file
      method: 'DELETE',
    }).then(loadDir);
    filename.value = '';                  //clears the filename and text area
    text.innerHTML = '';
  }else console.error('missing filename');
  location.reload();                    //refreshes the page to update the directory on the page
}
deletefile.addEventListener('click', deleteSubmit);       //adds click listener

//---------------------------------------------------------
//creates a new directory with a MKCOL request
function publishDir(event) {              //creates a new sub directory
  event.preventDefault();
  fetch(`${root}/${dirname.value}`, {       //Makes MKCOL request with name for directory
    method: "MKCOL",
  }).then(loadDir);
  location.reload();              //refreshes the page after a directory is made
}
publish.addEventListener('click', publishDir);      //adds click listener
