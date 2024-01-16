import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const SearchUserCards = () => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [chips, setChips] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedChip, setHighlightedChip] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function getUsers() {
      const response = await axios.get('https://api.github.com/users');
      setItems(
        response.data.map((user) => {
          return {
            "name": user.login,
            "gitUrl": user.html_url,
            "image": user.avatar_url
          }
        })
      );
    }
    getUsers();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilteredItems(
        items.filter(
          (item) =>
            !chips.map((chip) => chip.name).includes(item.name) &&
            item.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [inputValue, chips, items]);

  const getRandomTransparentColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const randomOpacity = Math.random().toFixed(2);
    return `#${randomColor}${Math.round(randomOpacity * 255).toString(16)}`;
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleItemSelect = (selectedItem) => {
    const randomColor = getRandomTransparentColor();
    setChips([...chips, { name: selectedItem, color: randomColor }]);
    setInputValue("");
  };

  const handleChipRemove = (removedChip) => {
    setChips(chips.filter((chip) => chip.name !== removedChip));
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Backspace" && inputValue === "" && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      setHighlightedChip(lastChip.name);
      event.preventDefault();
    }
    if (event.key === "Backspace" && highlightedChip) {
      handleChipRemove(highlightedChip);
      setHighlightedChip(null);
    }
  };

  return (
    <div className="chip-container">
      <div className="chip-input-container">
        {chips.map((chip, index) => (
          <div
            key={index}
            className={`chip ${highlightedChip === chip.name ? 'highlighted' : ''}`}
            style={{ backgroundColor: chip.color }}
          >
            <img
              src={items.find((item) => item.name === chip.name)?.image}
              alt={chip.name}
              className="chip-avatar"
            />
            {chip.name}{" "}
            <span
              onClick={() => handleChipRemove(chip.name)}
              className="chip-remove"
            >
              X
            </span>
          </div>
        ))}

        <div>
          <input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Type to search..."
          />

          {showSuggestions && inputValue.length < 1 && (
            <div className="box">
              <div className="item-list">
                {filteredItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemSelect(item.name)}
                    className="item"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-avatar"
                    />
                    {item.name} ({item.gitUrl})
                  </div>
                ))}
              </div>
            </div>
          )}
          {inputValue.length > 0 && (
            <div className="item-list">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemSelect(item.name)}
                  className="item"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-avatar"
                  />
                  {item.name} ({item.gitUrl})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUserCards;
