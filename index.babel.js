'use strict';

// face cards not yet implemented
// fix little off-centeredness in pips
// image-loading part needs cleaning up

var getImage = function(url, img) {
  return new Promise(function(resolve, reject) {
    img.onload = () => { 
      resolve();
    };
    img.onerror = () => { reject() };
    img.src = url;
  });
};

var colorRef = { "hearts": "red", "diamonds": "red", "spades": "black", "clubs": "black" };
var faceCardRef = { 1: "A", 11: "J", 12: "Q", 13: "K" };
var suits = ["hearts", "spades", "clubs", "diamonds"];

var drawCards = function() {
  class Card extends React.Component {
    constructor() {
      super();
      this.state = {
        showingFront: false
      }
    }
    
    componentWillMount() {
      let s = [1, 8, 14, 19, 23, 26, 28].indexOf(this.props.cardNum) > -1 ? true : false;
      this.setState({ showingFront: s });
    }
    
    flip() {
      this.setState({ showingFront: !this.state.showingFront });
    }
    
    render() {
      var iconStyle = { top: ["spades", "hearts"].indexOf(this.props.suit) > -1 ? "1%": "-100%", 
                        left: ["spades", "diamonds"].indexOf(this.props.suit) > -1 ? "2%" : "-105%", 
                        position: "absolute" };
      var pips = [];
      
      // adds the pips, rotating for those on the bottom half of the card
      if (this.props.value < 11) {
        let midpoint = parseInt(Math.ceil(this.props.value/2)) - 1;
        for (let i = 0; i < this.props.value; i++) {
          let t = i > midpoint ? "rotate(180deg)" : 0;
          let s = { transform: t };
          pips.push(
            <div className='bigCardIcon' style={ s }>
              <img className='bigIconImage' src={ cardIcons.src } style={ iconStyle }/>
            </div>
          );
        }
      }
      
      // vertical styling for aces, twos, threes
      let cardCenterStyle = this.props.value > 3 ? 
          { justifyContent: "center" } : 
          { justifyContent: "space-around", flexDirection: "column" };
      
      // so the face cards are letters instead of numbers
      let cardValue = [1, 11, 12, 13].indexOf(this.props.value) > -1 ? 
                      faceCardRef[this.props.value] : 
                      this.props.value;
            
      // positioning each card
      let cardStyle = { top: 0, left: 0 };
      if (this.props.cardNum < 29) {
        let rowRef = [8, 14, 19, 23, 26, 28, 29], 
            row;
        for (let i = 0; i < 7; i++) {
          if (rowRef[i] > this.props.cardNum) {
            row = i;
            break;
          }
        }
        cardStyle["top"] = 17 + 2*row + "vw";
        let moduloRef = [7, 7, 13, 18, 22, 25, 27];
        cardStyle["left"] = 13*row + ((this.props.cardNum - 1)%moduloRef[row])*13 + "vw";
      }
      
      return (
        <div className='card' onClick={ this.flip.bind(this) } style={ cardStyle } id={this.props.cardNum}>
          { this.state.showingFront ? 
            <div className='cardfront' style={{ color: colorRef[this.props.suit] }}>
              <div className='value-top-left'>
                { cardValue }
                <div className='cardIcon'>
                  <img className='iconImage' src={ cardIcons.src } style={ iconStyle }/>
                </div>
              </div>
              
            { this.props.value > 10 ? 
              <div className='cardCenter'>face</div>
              : 
              <div className='cardCenter' style={ cardCenterStyle }>{ pips }</div>
            }
              
              <div className='value-bottom-right'>
                { cardValue }
                <div className='cardIcon'>
                  <img className='iconImage' src={ cardIcons.src } style={ iconStyle }/>
                </div>
              </div>
            </div>
            : 
            <img className='cardback' src={ cardbackImg.src }/>
          }
        </div>
      )
    }
  }

  class Deck extends React.Component {
    render() {
      let cards = [], 
          available = [];
      
      for (let i = 0; i < 52; i++) {
        available.push(i+1);
      }
      
      for (let i = 1; i < 53; i++) {
        let x = Math.floor(Math.random() * (53 - i));
        let val = ((available[x] - 1) % 13) + 1, 
            suit = suits[parseInt((available[x]-1)/13)];
        cards.push(
          <Card value={ val } suit={ suit } cardNum={ i } />
        );
        available.splice(x, 1);
      }
      return (
        <div className='deck'>
          { cards }
        </div>
      )
    }
  }
  
  ReactDOM.render(<Deck />, document.getElementById('app'));
}



var cardbackImg = new Image();
var cardIcons = new Image();

var nextImage = getImage("https://thomaslmcdonald.files.wordpress.com/2010/09/4044e-hoyleback.jpg", cardbackImg)
  .then(drawCards)
  .catch((err) => { console.log(String(err)); });

getImage("http://data.whicdn.com/images/74899655/large.png", cardIcons)
  .then(nextImage)
  .catch((err) => { console.log(String(err)); });