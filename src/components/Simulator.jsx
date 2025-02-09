import { useState, useEffect } from "react";
import { seriesList } from "../data/popmart";
import { motion } from "framer-motion";

const Simulator = () => {
  const [selectedSeries, setSelectedSeries] = useState("Weaving Wonders");
  const [openedFigures, setOpenedFigures] = useState([]); // Track all opened figures
  const [numBoxes, setNumBoxes] = useState(1); // Store the number of boxes to open
  const [collection, setCollection] = useState([]); // Track collected figures
  const [activeTab, setActiveTab] = useState("open"); // Active tab ("open" or "collection")

  // Whenever the series changes, reset the opened figures list
  useEffect(() => {
    setOpenedFigures([]);
  }, [selectedSeries]);

  // Function to open boxes
  const openBoxes = () => {
    const series = seriesList[selectedSeries];
    const newOpenedFigures = [];

    for (let i = 0; i < numBoxes; i++) {
      const randomPick = getRandomFigure(series);
      newOpenedFigures.push(randomPick);
    }

    setOpenedFigures(newOpenedFigures); // Update with all opened figures
    updateCollection(newOpenedFigures); // Add new figures to collection
  };

  // Function to update the collection with new figures
  const updateCollection = (newFigures) => {
    setCollection((prevCollection) => {
      // Add new figures to the collection, making sure no duplicates
      const updatedCollection = [...prevCollection];
      newFigures.forEach((fig) => {
        if (!updatedCollection.some((item) => item.name === fig.name)) {
          updatedCollection.push(fig);
        }
      });
      return updatedCollection;
    });
  };

  const getRandomFigure = (series) => {
    let totalProbability = 0;

    // Calculate total probability (sum of all figure rarities)
    series.forEach((fig) => {
      totalProbability += fig.rarity;
    });

    let randomNum = Math.random() * totalProbability; // Random number within total probability
    for (let fig of series) {
      randomNum -= fig.rarity;
      if (randomNum <= 0) return fig; // Return the entire figure object
    }

    return null; // Fallback if no figure is selected (this should never happen)
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Pop Mart Opening Simulator</h1>

      {/* Tabs for navigating between "Open Boxes" and "Collection" */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab("open")}
          className={`${
            activeTab === "open" ? "bg-blue-500 text-white" : "bg-gray-200"
          } p-2 rounded-lg`}
        >
          Open Boxes
        </button>
        <button
          onClick={() => setActiveTab("collection")}
          className={`${
            activeTab === "collection" ? "bg-blue-500 text-white" : "bg-gray-200"
          } p-2 rounded-lg`}
        >
          Collection
        </button>
      </div>

      {/* "Open Boxes" Tab Content */}
      {activeTab === "open" && (
        <div className="flex flex-col items-center space-y-4">
          {/* Dropdown to select series */}
          <select
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          >
            {Object.keys(seriesList).map((series) => (
              <option key={series}>{series}</option>
            ))}
          </select>

          {/* Input to select number of boxes */}
          <div>
            <label htmlFor="numBoxes">Number of Boxes: </label>
            <input
              id="numBoxes"
              type="number"
              min="1"
              value={numBoxes}
              onChange={(e) => setNumBoxes(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 ml-2"
            />
          </div>

          {/* Button to open boxes */}
          <motion.button
            onClick={openBoxes}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Open {numBoxes} Box{numBoxes > 1 ? "es" : ""}
          </motion.button>

          {/* Display the opened figures with animation */}
          {openedFigures.length > 0 && (
            <div>
              <h2 className="mt-4">You got:</h2>
              <ul className="space-y-4">
                {openedFigures.map((fig, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2,
                      ...(index === 0
                        ? { type: "spring", stiffness: 100, damping: 20 }
                        : {}),
                    }}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={fig.image}
                      alt={fig.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                      }}
                      className="border-2 border-gray-300 rounded-lg"
                    />
                    <span>{fig.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* "Collection" Tab Content */}
      {activeTab === "collection" && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Your Collection:</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {collection.length > 0 ? (
              collection.map((fig, index) => (
                <div key={index} className="text-center">
                  <img
                    src={fig.image}
                    alt={fig.name}
                    style={{ width: "50px", height: "50px" }}
                    className="object-contain border-2 border-gray-300 rounded-lg"
                  />
                  <p className="mt-2">{fig.name}</p>
                </div>
              ))
            ) : (
              <p>No figures unlocked yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;
