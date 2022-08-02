function Swap(props) {
  return (
    <div>
      <iframe
        src={`https://app.uniswap.org/#/swap?theme=dark&outputCurrency=${props.addressCMC}`}
        height="660px"
        width="100%"
        style={{
          alignSelf: "center",
          border: 0,
          margin: 0,
          display: "block",
          borderRadius: "10px",
          maxWidth: "600px",
          minWidth: "300px",
        }}
      />
    </div>
  );
}

export default Swap;
