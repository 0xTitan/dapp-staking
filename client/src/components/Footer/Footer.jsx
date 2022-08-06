import "./Footer.css";

function Link({ uri, text }) {
  return (
    <a href={uri} target="_blank" rel="noreferrer">
      {text}
    </a>
  );
}

function Footer(props) {
  return (
    <footer>
      <h2>Pricing 💰</h2>
      <br />
      <p>
        <b>ETH: </b> {props.ethPrice}$
      </p>
      <br />
      <p>
        <b>CMC: </b> {props.cmcPrice}$
      </p>
      <br />
      <button
        onClick={() => {
          props.getPricesOnRefresh();
        }}
      >
        🔄 Refresh Prices
      </button>
      <br />
      <br />
      <h2>More resources 📚</h2>
      <Link uri={"https://trufflesuite.com"} text={"Truffle"} />
      <Link uri={"https://reactjs.org"} text={"React"} />
      <Link uri={"https://soliditylang.org"} text={"Solidity"} />
      <Link uri={"https://ethereum.org"} text={"Ethereum"} />
    </footer>
  );
}

export default Footer;
