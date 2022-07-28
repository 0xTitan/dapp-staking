function UserInformations(props) {
  return (
    <div>
      <ul>
        <li>
          Your address is:{" "}
          <span style={{ fontWeight: "bold" }}>{props.userAddress}</span>
        </li>
        <li>
          Dapp contract address:{" "}
          <span style={{ fontWeight: "bold" }}>{props.contractAddress}</span>
        </li>
        {/* <li>
          Owner address:{" "}
          <span style={{ fontWeight: "bold" }}>{props.ownerAddress}</span>
        </li> */}
      </ul>
    </div>
  );
}

export default UserInformations;
