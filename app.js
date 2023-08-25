$(document).ready(function () {
  const $table = $('#jeopardy');

  let categories = [];

  //Gets 6 random categories from jservice API
  async function getCategoryIds() {
    let response = await axios.get(
      'https://jservice.io/api/categories?count=100'
    );
    //Randomly select 6 categories using Lodash sampleSize
    const randomCats = _.sampleSize(response.data, 6);

    //Create a new array containing category ids and push each one to getCategory()
    const idArray = randomCats.map((el) => `${el.id}`);
    for (let id of idArray) {
      await getCategory(id);
    }
  }

  //Returns an object with data about a category
  async function getCategory(catId) {
    let response = await axios.get(
      `https://jservice.io/api/category?id=${catId}`
    );

    //Access response.data and fetch 5 random clues
    const { data } = response;
    const ranClues = _.sampleSize(data.clues, 5);

    //Create a new clueArray and store the corresponding clue key:value pairs
    const clueArray = ranClues.map((clue) => ({
      question: clue.question,
      answer: clue.answer,
      showing: null,
    }));

    //Push an object containing the category title and new clueArray
    categories.push({
      title: data.title,
      clues: clueArray,
    });
  }

  /* 
  Fill the HTML table#jeopardy with the categories & cells for questions.
  - The <thead> should be filled w/a <tr>, and a <td> for each category
  - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
    each with a question for each category in a <td>
    (initally, just show a "?" where the question/answer would go.)
*/
  async function fillTable() {
    await getCategoryIds();
    $table.addClass('container table table-dark table-bordered');
    const $headRow = $('<tr>');

    //Iterate through the category objs within the categories array
    for (let category of categories) {
      //Append category title to each td within the header row
      const $headCells = $('<td>').text(category.title);
      $headRow.append($headCells);

      //Append the header row to the table head
      $table.find('thead').append($headRow);
    }

    //Iterate through each category's clue array which contains 5 clues
    for (let i = 0; i < 5; i++) {
      const $bodyRow = $('<tr>');
      /* Iterate over each category obj within the categories array 
       For each category, access the corresponding clue at index 'i' and create a new td element */
      categories.forEach(() => {
        const $td = $('<td>').text('?');
        $bodyRow.append($td);
      });
      /* After creating all cells for the current clue at index i,append the bodyRow to tbody */
      $table.find('tbody').append($bodyRow);
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
    const $target = $(evt.target);
    const columnIndex = $target.index();
    const rowIndex = $target.closest('tr').index();

    const clue = categories[columnIndex].clues[rowIndex];

    if (clue.showing === null) {
      clue.showing = 'question';
      $target.text(clue.question);
    } else if (clue.showing === 'question') {
      clue.showing = 'answer';
      $target.text(clue.answer);
    }
  }

  /*
   Wipe the current Jeopardy board, show the loading spinner,
   and update the button used to fetch data.
 */
  function showLoadingView() {}

  /** Remove the loading spinner and update the button used to fetch data. */
  function hideLoadingView() {}

  /** Start game:
   *
   * - get random category Ids
   * - get data for each category
   * - create HTML table
   * */

  async function setupAndStart() {
    await fillTable();
  }

  /** On click of start / restart button, set up game. */
  $('#start').on('click', setupAndStart);
  // TODO

  /** On page load, add event handler for clicking clues */
  $(document).on('click', 'tbody td', handleClick);
});
