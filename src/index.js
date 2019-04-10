let view = (() => {
    let transitionIndex = 0;
    let currentSlide = -1;
    let DOMElements = {
        transitionContainer: document.querySelector("#transition-container"),
        buttonContainer: document.querySelector("#button-container"),
        buttons: {
            previousButton: document.querySelector("#previous-btn"),
            nextButton: document.querySelector("#next-btn")
        },
        generated: {}
    };

    let generator = {
        createElements: (
            element = "div",
            apply,
            amount = 3,
            keepPlaceHolder = true,
            replacePlaceHolder
        ) => {
            let elArr = [];

            for (let i = 0; i < amount; i++) {
                let count = i + 1;

                let el = document.createElement(element);

                if (keepPlaceHolder) {
                    el.classList.add(element + [count]);
                    el.innerHTML = `<h1> ${element} ${count}</h1>`;
                } else if (!keepPlaceHolder) {
                    replacePlaceHolder(
                        el,
                        "id",
                        "transition" + [count],
                        "Transition" + [count]
                    );
                }
                apply.appendChild(el);
                elArr[i] = el;
            }

            DOMElements.generated[element] = elArr;
        },
        customElement: (cur, css, name, text) => {
            if (css === "id") {
                cur.id = name;
            } else if (css === "class") {
                cur.classList.add(name);
            }
            cur.innerText = text;
        },
        createTransitionObject: amount => {
            let transitions = {
                next: {},
                previous: {},
                setup: {
                    Left: [],
                    Right: []
                },
                after: {}
            };

            for (let i = 0; i < amount; i++) {
                count = i + 1;
                transitions.next[i] = "next" + [count];
                transitions.previous[i] = "previous" + [count];
                transitions.setup.Right.push("setupRight" + [count]);
                transitions.setup.Left.push("setupLeft" + [count]);
                transitions.after[i] = "after" + [count];
            }

            DOMElements.generated.transitions = transitions;
        }
    };

    let handleClicks = {
        addClickEvent: () => {
            DOMElements.buttons.previousButton.addEventListener(
                "click",
                handleClicks.clickFunctions.previous
            );
            DOMElements.buttons.nextButton.addEventListener(
                "click",
                handleClicks.clickFunctions.next
            );

            for (let i = 0; i < DOMElements.generated.button.length; i++) {
                DOMElements.generated.button[i].addEventListener("click", () => {
                    handleClicks.clickFunctions.transitionHandler(i);
                });
            }
        },

        clickFunctions: {
            previous: () => {
                indexHandler(false);
            },
            next: () => {
                indexHandler(true);
            },
            transitionHandler: (index) => {
                transitionIndex = index;
                currentSlide = -1;
                handleClicks.clickFunctions.next();
            },
        },


        switchSlide: (slideIndex, currentDiv, side) => {
            let slideIntervals = {
                setup: 100,
                slide: 300,
                after: 200
            };
            
            //remove all classes
            removeCssClasses(DOMElements.generated.div);

            //add setup for slide
            let addSetup = () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        DOMElements.generated.div[currentDiv].classList.add(
                            DOMElements.generated.transitions.setup[side][slideIndex]
                        );
                        resolve("Added setup");
                    }, slideIntervals.setup);
                });
            };

            //add slide
            let addSlide = () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (side === "Right") {
                            DOMElements.generated.div[currentDiv].classList.add(
                                DOMElements.generated.transitions.next[slideIndex]
                            );
                        } else if (side === "Left") {
                            DOMElements.generated.div[currentDiv].classList.add(
                                DOMElements.generated.transitions.previous[slideIndex]
                            );
                        }
                        resolve("added Slide");
                    }, slideIntervals.slide);
                });
            };

            let addAfter = () => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  DOMElements.generated.div[currentDiv].classList.add(
                    DOMElements.generated.transitions.after[slideIndex]
                  );

                  resolve("added after");
                }, slideIntervals.after);
              });
            };

            addSetup()
                .then(res => {
                    return addSlide();
                })
                .then(res => {
                    return addAfter();
                })
                .then(res => {})
                .catch(err => {
                    alert(err);
                });
        }
    };
    indexHandler = increment => {
        if (
            increment === true &&
            currentSlide < DOMElements.generated.div.length - 1
            
        ) {
            currentSlide++;
            handleClicks.switchSlide(transitionIndex, currentSlide, "Right");
        } else if (increment === false && currentSlide > 0) {
            currentSlide--;
            handleClicks.switchSlide(transitionIndex, currentSlide, "Left");
        }
    };

    let removeCssClasses = items => {
        for (let i = 0; i < items.length; i++) {
            items[i].className = "div" + [i + 1];
        }
    };
    return {
        DOMElements,
        generator,
        handleClicks,
        createElementsArgs: {
            div: ["div", DOMElements.transitionContainer, 3],
            button: ["button", DOMElements.buttonContainer, 3, false]
        }
    };
})();

let controller = (() => {
    //generate divs
    view.generator.createElements(...view.createElementsArgs.div);
    //generate buttons
    view.generator.createElements(
        ...view.createElementsArgs.button,
        view.generator.customElement
    );

    //create setup, transition objects based on how many css transition
    view.generator.createTransitionObject(3);

    view.handleClicks.addClickEvent();

    view.handleClicks.clickFunctions.next();
})();