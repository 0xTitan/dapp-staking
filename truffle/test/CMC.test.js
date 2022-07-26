// erc20.test.js
const {
  BN,
  ether,
  expectEvent,
  expectRevert,
} = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const CMC = artifacts.require("CMC");
contract("CMC", function (accounts) {
  const _name = "CAMACL";
  const _symbol = "CMC";
  const _initialsupply = new BN(1000);
  const _decimals = new BN(18);
  const owner = accounts[0];
  const recipient = accounts[1];
  const spender = accounts[2];

  beforeEach(async function () {
    this.CMCInstance = await CMC.new(_initialsupply, { from: owner });
  });

  it("a un nom", async function () {
    expect(await this.CMCInstance.name()).to.equal(_name);
  });
  it("a un symbole", async function () {
    expect(await this.CMCInstance.symbol()).to.equal(_symbol);
  });
  it("a une valeur décimal", async function () {
    expect(await this.CMCInstance.decimals()).to.be.bignumber.equal(_decimals);
  });
  it("vérifie la balance du propriétaire du contrat", async function () {
    let balanceOwner = await this.CMCInstance.balanceOf(owner);
    let totalSupply = await this.CMCInstance.totalSupply();
    expect(balanceOwner).to.be.bignumber.equal(totalSupply);
  });
  it("vérifie si un transfer est bien effectué", async function () {
    let balanceOwnerBeforeTransfer = await this.CMCInstance.balanceOf(owner);
    let balanceRecipientBeforeTransfer = await this.CMCInstance.balanceOf(
      recipient
    );
    let amount = new BN(10);

    await this.CMCInstance.transfer(recipient, amount, { from: owner });
    let balanceOwnerAfterTransfer = await this.CMCInstance.balanceOf(owner);
    let balanceRecipientAfterTransfer = await this.CMCInstance.balanceOf(
      recipient
    );

    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(
      balanceOwnerBeforeTransfer.sub(amount)
    );
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(
      balanceRecipientBeforeTransfer.add(amount)
    );
  });
  it("vérifie si une adresse est approuve", async function () {
    let approvedAmountBefore = await this.CMCInstance.allowance(owner, spender);
    let amount = new BN(1);
    let isApproved = await this.CMCInstance.approve(spender, amount, {
      from: owner,
    });
    expectEvent(isApproved, "Approval", {
      owner: owner,
      spender: spender,
      value: amount,
    });
    let approvedAmount = await this.CMCInstance.allowance(owner, spender);

    expect(approvedAmount).to.be.bignumber.equal(
      approvedAmountBefore.add(amount)
    );
  });
  it("vérifie si une adresse à pu faire un transfer", async function () {
    /*The use-case is that you give permission for someone else to transfer from your account (contract in that case).
      The owner give the permission to spender account to transfer token from the contract.
      Then spender can use the function transferFrom once it's approved*/

    let balanceOwnerBeforeTransfer = await this.CMCInstance.balanceOf(owner);
    let balanceRecipientBeforeTransfer = await this.CMCInstance.balanceOf(
      recipient
    );
    let amount = new BN(1);
    await this.CMCInstance.approve(spender, amount, {
      from: owner,
    });
    await this.CMCInstance.transferFrom(owner, recipient, amount, {
      from: spender,
    });
    let balanceOwnerBeforeAfter = await this.CMCInstance.balanceOf(owner);
    let balanceRecipientAfter = await this.CMCInstance.balanceOf(recipient);

    expect(balanceOwnerBeforeAfter).to.be.bignumber.equal(
      balanceOwnerBeforeTransfer.sub(amount)
    );

    expect(balanceRecipientAfter).to.be.bignumber.equal(
      balanceRecipientBeforeTransfer.add(amount)
    );
  });
  it("vérifie si une adresse à son transfer refusé si le montant dépasse ce qui a été approuvé", async function () {
    /*The use-case is that you give permission for someone else to transfer from your account (contract in that case).
      The owner give the permission to spender account to transfer token from the contract.
      Then spender can use the function transferFrom once it's approved*/

    let balanceOwnerBeforeTransfer = await this.CMCInstance.balanceOf(owner);
    let balanceRecipientBeforeTransfer = await this.CMCInstance.balanceOf(
      recipient
    );
    let amount = new BN(1);
    let overAmount = new BN(2);
    await this.CMCInstance.approve(spender, amount, {
      from: owner,
    });

    await expectRevert(
      this.CMCInstance.transferFrom(owner, recipient, overAmount, {
        from: spender,
      }),
      "ERC20: insufficient allowance"
    );
  });
});
