import "./UserInformations.css";

function UserInformations(props) {
  return (
    // <div>
    //   <ul>
    //     <li>
    //       Your address is:{" "}
    //       <span style={{ fontWeight: "bold" }}>{props.userAddress}</span>
    //     </li>
    //     <li>
    //       Dapp contract address:{" "}
    //       <span style={{ fontWeight: "bold" }}>{props.contractAddress}</span>
    //     </li>
    //     <li>
    //       Balance: <span style={{ fontWeight: "bold" }}>{props.balance}</span>
    //     </li>
    //     <li>
    //       networkID :{" "}
    //       <span style={{ fontWeight: "bold" }}>{props.networkID}</span>
    //     </li>
    //     {/* <li>
    //       Owner address:{" "}
    //       <span style={{ fontWeight: "bold" }}>{props.ownerAddress}</span>
    //     </li> */}
    //   </ul>
    // </div>
    <div>
      {props.userAddress && (
        <div className="class-accountInfo">
          <p className="class-itemAccountInfo">{props.userAddress}</p>
          <p className="class-itemAccountInfo">{props.balance}</p>
          <p className="class-itemAccountInfo">{props.balanceCMC}</p>
          <p className="class-itemAccountInfo">{props.network}</p>
        </div>
      )}
      {!props.userAddress && (
        <div className="class-accountInfo">
          <p className="class-itemAccountInfo">Not connected</p>
        </div>
      )}
    </div>
  );
}

export default UserInformations;
