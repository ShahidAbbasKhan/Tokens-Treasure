const { assert } = require('chai');

describe('ERC20Treasure', function () {
    let coinCreator, coinCreatorSigner, hunter, hunterSigner; 

    describe('storing erc20 tokens', () => {
        let erc20fixedSupply;
        let erc20fixedSupply2;
        let erc20treasure;
        beforeEach(async () => {
            const ERC20FixedSupply = await ethers.getContractFactory("ERC20FixedSupply");
            
            erc20fixedSupply = await ERC20FixedSupply.deploy(10000);
            await erc20fixedSupply.deployed();

            erc20fixedSupply2 = await erc20fixedSupply.deploy(10000);
            await erc20fixedSupply2.deployed();

            const ERC20Treasure = await ethers.getContractFactory("ERC20Treasure");
            erc20treasure = await ERC20Treasure.deploy();
            await erc20treasure.deployed();

            const accounts = await ethers.provider.listAccounts();
            coinCreator = accounts[0];
            coinCreatorSigner = ethers.provider.getSigner(coinCreator);
            hunter = accounts[1];
            hunterSigner = ethers.provider.getSigner(hunter);
        });

        describe('storing some erc20fixedSupply', () => {
            beforeEach(async () => {
                await erc20fixedSupply.connect(coinCreatorSigner).transfer(erc20treasure.address, 1000);
            });

            it('should let us store erc20fixedSupply at the address', async () => {
                const balance = await erc20fixedSupply.balanceOf(erc20treasure.address);
                console.log(balance);
                assert.strictEqual(balance.toString(), '1000');
            });

            describe('after getTokens', () => {
                beforeEach(async () => {
                    await erc20treasure.connect(hunterSigner).getTokens([erc20fixedSupply.address]);
                });

                it('should award the hunter the balance', async () => {
                    const hunterBalance = await erc20fixedSupply.balanceOf(hunter);
                    assert.strictEqual(hunterBalance.toString(), '1000');
                });

                it('should remove the balance from the erc20treasure', async () => {
                    const balance = await erc20fixedSupply.balanceOf(erc20treasure.address);
                    assert.strictEqual(balance.toString(), '0');
                });
            });
        });

        describe('storing some erc20fixedSupply and erc20fixedSupply2', () => {
            beforeEach(async () => {
                await erc20fixedSupply.connect(coinCreatorSigner).transfer(erc20treasure.address, 250);
                await erc20fixedSupply2.connect(coinCreatorSigner).transfer(erc20treasure.address, 300);
            });

            it('should let us store erc20fixedSupply at the address', async () => {
                const balance = await erc20fixedSupply.balanceOf(erc20treasure.address);
                assert.strictEqual(balance.toString(), '250');
            });

            it('should let us store erc20fixedSupply2 at the address', async () => {
                const balance = await erc20fixedSupply2.balanceOf(erc20treasure.address);
                assert.strictEqual(balance.toString(), '300');
            });

            describe('after pludering erc20fixedSupply2', () => {
                beforeEach(async () => {
                    await erc20treasure.connect(hunterSigner).getTokens([erc20fixedSupply2.address]);
                });

                it('should not award the hunter the erc20fixedSupply', async () => {
                    const hunterBalance = await erc20fixedSupply.balanceOf(hunter);
                    assert.strictEqual(hunterBalance.toString(), '0');
                });

                it('should award the hunter the erc20fixedSupply2', async () => {
                    const hunterBalance = await erc20fixedSupply2.balanceOf(hunter);
                    assert.strictEqual(hunterBalance.toString(), '300');
                });

                it('should not remove the erc20fixedSupply from the erc20treasure', async () => {
                    const balance = await erc20fixedSupply.balanceOf(erc20treasure.address);
                    assert.strictEqual(balance.toString(), '250');
                });

                it('should remove the erc20fixedSupply2 from the erc20treasure', async () => {
                    const balance = await erc20fixedSupply2.balanceOf(erc20treasure.address);
                    assert.strictEqual(balance.toString(), '0');
                });
            });

            describe('upon getTokensing both', () => {
                beforeEach(async () => {
                    await erc20treasure.connect(hunterSigner).getTokens([erc20fixedSupply.address, erc20fixedSupply2.address]);
                });

                it('should award the hunter the erc20fixedSupply', async () => {
                    const hunterBalance = await erc20fixedSupply.balanceOf(hunter);
                    assert.strictEqual(hunterBalance.toString(), '250');
                });

                it('should award the hunter the erc20fixedSupply2', async () => {
                    const hunterBalance = await erc20fixedSupply2.balanceOf(hunter);
                    assert.strictEqual(hunterBalance.toString(), '300');
                });

                it('should remove the erc20fixedSupply from the erc20treasure', async () => {
                    const balance = await erc20fixedSupply.balanceOf(erc20treasure.address);
                    assert.strictEqual(balance.toString(), '0');
                });

                it('should remove the erc20fixedSupply2 from the erc20treasure', async () => {
                    const balance = await erc20fixedSupply2.balanceOf(erc20treasure.address);
                    assert.strictEqual(balance.toString(), '0');
                });
            });
        });
    });
});





