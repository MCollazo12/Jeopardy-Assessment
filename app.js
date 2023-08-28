let categories = [];
let isLoading = false;

//Gets 100 categories from the jservice API
async function getCategoryIds() {
  let response = await axios.get('https://jservice.io/api/categories?count=20');

  if (response.status === 429) {
    const wait = Number(response.headers.get('retry-after'));
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
  }

  const { data } = response;
  const catIds = data.map((cat) => cat.id);
  //Use Lodash sampleSize to return only 6 random category ids
  return _.sampleSize(catIds, 6);
}

//Returns an object with data about a category
async function getCategory(catId) {
  let response = await axios.get(
    `https://jservice.io/api/category?id=${catId}`
  );

  //Access response.data and fetch 5 random clues
  const { data } = response;
  const ranClues = _.sampleSize(data.clues, 5);

  //Create a new clueArray and store the corresponding clue key value pairs
  const clueArray = ranClues.map((clue) => ({
    question: clue.question,
    answer: clue.answer,
    showing: null,
  }));

  //Return an object containing the category title and the new clueArray
  return { title: data.title, clueArray };
}

/* 
    Fill the HTML table#jeopardy with the categories & cells for questions.
    - The <thead> should be filled w/a <tr>, and a <td> for each category
    - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
      each with a question for each category in a <td>
      (initally, just show a "?" where the question/answer would go.)
  */
async function fillTable() {
  $('#jeopardy thead').empty();
  $('#jeopardy tbody').empty();
  $('#jeopardy').addClass('table table-md table-dark table-bordered w-75');
  let $tableRow = $('<tr>');

  //Iterate through the category objs within the categories array();
  for (let category of categories) {
    //Append category title to each td within the header row
    $tableRow.append($('<th>').text(category.title));
  }
  $('#jeopardy thead').append($tableRow);

  //Iterate through each category's clue array which contains 5 clues();
  for (let clueIdx = 0; clueIdx < 5; clueIdx++) {
    let $tableRow = $('<tr>');
    /* Iterate over each category obj within the categories array 
         For each category, access the corresponding clue at index 'i' and create a new td element */
    for (let catIdx = 0; catIdx < 6; catIdx++) {
      $tableRow.append($('<td>').attr('id', `${catIdx}-${clueIdx}`).text('?'));
    }
    /* After creating all cells for the current clue at index i,append the bodyRow to tbody */
    $('#jeopardy tbody').append($tableRow);
  }
}

/* 
    Handle clicking on a clue: show the question or answer.
    Uses .showing property on clue to determine what to show:
     - if currently null, show question & set .showing to "question"
     - if currently "question", show answer & set .showing to "answer"
     - if currently "answer", ignore click
   */
function handleClick(evt) {
  //Get target cell id (ex. id="1-2") -> split into a new array -> locate clue obj with the new array indexes
  const cellId = evt.target.id;
  const [catId, clueId] = cellId.split('-');
  const clue = categories[catId].clueArray[clueId];

  let cellText;

  /*On click, update the target clue's showing property,
      and set the text to either the obj's clue.question if showing: null,
      or clue.answer if showing: question */
  if (clue.showing === null) {
    clue.showing = 'question';
    cellText = clue.question;
  } else if (clue.showing === 'question') {
    clue.showing = 'answer';
    cellText = clue.answer;
  } else {
    return;
  }

  //Update the cell's html based on the showing property
  $(`#${catId}-${clueId}`).html(cellText);
}

/* 
    Start game:
    - get random category Ids
    - get data for each category
    - create HTML table
*/
async function setupAndStart() { 
  let catIds = await getCategoryIds();
  categories = [];

  for (let catId of catIds) {
    //pass catIds to getCategory -> push to categories array
    categories.push(await getCategory(catId)); 
  }

  fillTable();
  $('#jeopardy').show() //show jeopardy table once it's filled
}

//Wipe the current Jeopardy board, show the loading spinner, and update the button used to fetch data.
function showLoadingView() {
  if (!isLoading) {
    $('#jeopardy').hide();
    $('#spin-container').show();
    $('#start').attr('id', 'reset').text('Reset');
    isLoading = false;  //update isLoading state
  }
  console.log("Loading..")
}

//Remove the loading spinner and update the button used to fetch data.
function hideLoadingView() {
  $('#spin-container').hide();
  isLoading = false;
  console.log('Spinner hidden')
}

/** On page load, add event handler for clicking clues */
$(document).ready(async function () {
  hideLoadingView();
  $('#jeopardy').on('click', 'tbody td', handleClick);

  /** On click of start / restart button, set up game. */
  $('#start').on('click', async function () {
    showLoadingView();
    await setupAndStart();
    hideLoadingView();
  });

  $('#reset').on('click', async function () {
    showLoadingView();
    await setupAndStart();
    hideLoadingView();
  });
});