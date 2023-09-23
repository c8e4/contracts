export const saleContract = `
{
		val priceNanoErg     	= SELF.R4[Long].get         // token sale price in nanoErg
		val sellerPK 			= SELF.R5[GroupElement].get // Public Key of the token seller
		val sellerAddress		= SELF.R6[Coll[Byte]].get   // seller receive address
		val feeAddress			= SELF.R7[Coll[Byte]].get   // ui Fee receive address

		val feeDenom 			= 100000L
        val devFee   			= 1000L
		val uiFee   			= (priceNanoErg.toBigInt * devFee.toBigInt) / feeDenom.toBigInt
		val onlyOneBoxSpent		= (OUTPUTS(0).R4[Coll[Byte]].get == SELF.id)
		val sellerHappy			= (OUTPUTS(0).value >= priceNanoErg - uiFee) && (OUTPUTS(0).propositionBytes == sellerAddress)
		val feePaid				= (uiFee == 0) ||
								  (OUTPUTS(1).value >= uiFee && OUTPUTS(1).propositionBytes == feeAddress)
		sigmaProp(onlyOneBoxSpent && sellerHappy && feePaid) || proveDlog(sellerPK)
}
`

/*
type ErgoTree = string

type Box = {
	value: number
	R1: any
	R2: any
	R3: any
	R4: any
	R5: any
	R6: any
	R7: any
	R8: any
	R9: any
	propositionBytes: ErgoTree,
}

const box1:Box = {value:10,R1: "", R2: "", R3: "", R4: "", R5: "", R6: "", R7: "", R8: "", R9:"", propositionBytes: "fad2cas2"};
const box2:Box = {value:10,R1: "", R2: "", R3: "", R4: "", R5: "", R6: "", R7: "", R8: "", R9:"", propositionBytes: "fad2cas2"};
const box3:Box = {value:10,R1: "", R2: "", R3: "", R4: "", R5: "", R6: "", R7: "", R8: "", R9:"", propositionBytes: "fad2cas2"};

type Transaction = {
	inputs: Array<Box>
	outputs: Array<Box>
}

const transaction: Transaction = {
	inputs: [box1, box2],
	outputs:[ box3]
}

function transactionIsValid(transaction:Transaction): boolean{
	transaction.inputs.forEach(box =>{
		const isValid = validateBoxCanBeSpend(transaction.inputs, transaction.outputs, box, box.propositionBytes)
		if(!isValid){
			return false
		}
	})

	// ENSURE (sum all inputs == sum all outputs)
	// ENSURE min fee paid
	return true;
}


function validateBoxCanBeSpend(INPUTS: Array<Box>, OUTPUTS: Array<Box>, SELF: Box, propositionBytes:ErgoTree):boolean{
	return excutePropositionBytes(propositionBytes, SELF, INPUTS, OUTPUTS)
}

function excutePropositionBytes(propositionBytes:ErgoTree, SELF:Box, INPUTS:Array<Box>, OUTPUTS:Array<Box>):boolean{
	return true;
}
*/