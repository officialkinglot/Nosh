import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const fullText = "Fidian Chops...The Best";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 150; // Typing speed
  const deletingSpeed = 50; // Deleting speed
  const delay = 2000; // Delay before restarting

  useEffect(() => {
    let timer;

    const handleTyping = () => {
      setDisplayText((prev) => {
        const currentLength = prev.length;
        if (!isDeleting) {
          // Typing the text
          if (currentLength < fullText.length) {
            return fullText.slice(0, currentLength + 1);
          } else {
            setIsDeleting(true);
            return prev;
          }
        } else {
          // Deleting the text
          if (currentLength > 0) {
            return fullText.slice(0, currentLength - 1);
          } else {
            setIsDeleting(false);
            return "";
          }
        }
      });
    };

    timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    if (!isDeleting && displayText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  return (
    <div className="header">
      <div className="header-contents">
        <h2 className="typing-effect">
          {displayText}
        </h2>
        <p></p>
        <a href="#explore-menu">
          <button>Enter Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
