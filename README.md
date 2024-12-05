# odin-calculator

A simple calculator made with HTML/CSS and vanilla JavaScript.<br/>
Has clickable interface and supports keyboard inputs.<br/>
Works just like any other non-scientific calculator.<br/>
Made as a part of the Odin Project curriculum.


# Features

- basic math operations: addition, subtraction, division, multiplication, percentages,
- input lock on error,
- undo button for editing the input/result one digit at a time,
- changing the sign,
- focus the display on its most significant part (start for result, end for input),
- rounding and formatting long decimals,
- highlighting buttons,
- sticky operator buttons allow knowing what kind of operation is currently being done,
- 'Clear' button,
- floating point button,
- allows for modifying not only input but the result as well,
- disable some of the browser default behaviors (no quickFind on '/' or going back with 'Backspace').


## Usage

Mouse: just click on the buttons;<br/><br/>
Keyboard:
- number keys for numerical input,
- '/' for division,
- '*' for multiplication,
- '-' for subtraction,
- '+' for addition,
- '%' for percentages,
- '`' (the tilde key) for changing the sign,
- 'Esc' for clearing all,
- 'Backspace' for deleting last digit,
- '.' or ',' for floating point,
- '=' or 'Enter' for result,
- (special) Ctrl+s for a small easter egg.


# Important

Has some problems with precision for VERY small/large numbers as JS stores them in exponential form.


## Author's notes

To whomever who has stumbled on this page:<br/><br/>
I know the code is kinda messy, and some things could've been done better/shorter/cleaner;<br/>
I could just look it up on the web, slap some eval's and call it a day, but where's the challenge?<br/>
I had to think about it on my own and go through many ideas and iterations.<br/>
It was difficult but mostly fun experience!<br/>
The point of this project was to get familiar with JS syntax and its quirks,<br/>
get a refresher on string/array/object manipulation, practice event handling and delegation.<br/>
It was also a good opportunity for learning about git branching.<br/>
I also tried to make it somewhat object-oriented but failed as the docs I was using at the beginning<br/>
were old and stated that there are no classes in JS (they lied!).<br/>
All of that hassle was not required though, so I left it as it is.
<br/><br/>
Thank you!