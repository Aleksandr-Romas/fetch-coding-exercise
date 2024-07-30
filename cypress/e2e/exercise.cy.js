


const weighBars = (left, right) => {
    cy.contains('.game-board', 'left').find('input').then(leftSquares => {
        left.forEach((el, i) => cy.wrap(leftSquares[i]).type(el))
    });

    cy.contains('.game-board', 'right').find('input').then(rightSquares => {
        right.forEach((el, i) => cy.wrap(rightSquares[i]).type(el))
    });


    cy.get('#weigh').click();
};

const handleWeighingResult = (first, second, third) => {
    cy.get('.result #reset').should('not.contain', '?').then(symbol => {

        cy.contains('button', 'Reset').click();

        if(symbol.text() === '<') gameResolver(first);
        else if(symbol.text() === '>') gameResolver(second);
        else if(symbol.text() === '=') gameResolver(third);
    })
};

const getListOfWeightResults = () => {
    cy.get('.game-info li').then(gameInfo => {
        const arr = [];

        gameInfo.each((_, el) => {
            arr.push(el.innerText)
        });

        console.log(arr);
    });
};

const alertListener = () => {
    cy.on('window:alert', (str) => {
        console.log('Alert received: ', str);
        expect(str).to.equal('Yay! You find it!');
    })
};

const gameResolver = (goldBars) => {
    if(goldBars.length < 2) {
        console.log('Fake gold bar is:', goldBars[0]);

        getListOfWeightResults();
        alertListener();

        cy.get(`#coin_${goldBars[0]}`).click();
        return;
    };

    const thirdOfTheArray = goldBars.length / 3;
    const firstChunk = goldBars.slice(0, thirdOfTheArray);
    const secondChunk = goldBars.slice(thirdOfTheArray, thirdOfTheArray * 2);
    const thirdChunk = goldBars.slice(thirdOfTheArray * 2);


    weighBars(firstChunk, secondChunk);
    handleWeighingResult(firstChunk, secondChunk, thirdChunk);
};


describe('CODING EXERCISE', () => {
    beforeEach(() => {
        cy.visit('/');
    });


    it('Resolve and verify the alert message', () => {
        gameResolver([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });
});
