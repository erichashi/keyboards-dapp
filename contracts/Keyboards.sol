// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {

	enum KeyboardKind {
		SixtyPercent, 
		SeventyFivePercent,
		EightyPercent, 
		Iso105 
	}

	struct Keyboard {
		KeyboardKind kind;
		bool isPBT;
		string filter;
		address owner;
	}

	//events are emitted at every time we want, using emit KeyboardCreated(newkeyboard)
	event KeyboardCreated (
		Keyboard keyboard
	);

	event TipSent(
		address recipient,
		uint256 amount
	);

	Keyboard[] public createdKeyboards;

    function getKeyboards() view public returns(Keyboard[] memory) {

        return createdKeyboards;
    }

    function create(KeyboardKind _kind, bool _isPBT, string calldata _filter) external {
		Keyboard memory newKB = Keyboard({
			kind: _kind,
			isPBT: _isPBT,
			filter: _filter,
			owner: msg.sender
		});
    	createdKeyboards.push(newKB);
		emit KeyboardCreated(newKB);
    }

	function tip(uint256 _index) external payable {
		address payable owner = payable(createdKeyboards[_index].owner);
		owner.transfer(msg.value);
		emit TipSent(owner, msg.value);
	}
	  
}
// npx hardhat compile
