import { sampleSize } from 'lodash';

//https://jservice.io/api/categories?count=6 -> get categories -> each category has an ID
//https://jservice.io/api/category?id=76 -> Use category ID to get clues and answers

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
let categories = [];

async function getCategoryIds() {
    //find a way to randomize the categories 
  let response = await axios.get('https://jservice.io/api/categories?count=100');
  const randomCats = _.sampleSize(response.data, 6)
    const idArray = randomCats.map((el) => `${el.id}`);
    for (let id of idArray) {
        await getCategory(id);
    }
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  let response = await axios.get(
    `https://jservice.io/api/category?id=${catId}`
  );
  const { data } = response;
  const ranClues = _.sampleSize(data.clues, 5);

  const clueArray = ranClues.map((clue) => ({
    question: clue.question,
    answer: clue.answer,
    showing: null,
  }));

  categories.push ({
    title: data.title,
    clues: clueArray,
  });
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
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

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
