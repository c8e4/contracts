export const saleContract = `
{
		val priceNanoErg     	= SELF.R4[Long].get         // token sale price in nanoErg
		val sellerPK 			= SELF.R5[GroupElement].get // Public Key of the token seller
		val sellerAddress		= SELF.R6[Coll[Byte]].get   // seller receive address
		val feeAddress			= SELF.R7[Coll[Byte]].get   // ui Fee receive address

		val feeDenom 			= 100000L
        val devFee   			= 1000L
		val uiFee   			= (priceNanoErg.toBigInt * devFee.toBigInt) / feeDenom.toBigInt
		val sellerHappy			= (OUTPUTS(0).value >= priceNanoErg - uiFee) && (OUTPUTS(0).propositionBytes == sellerAddress)
		val feePaid				= (uiFee > 0) && (OUTPUTS(1).value >= uiFee) && (OUTPUTS(1).propositionBytes == feeAddress)

		sigmaProp(sellerHappy && feePaid) || proveDlog(sellerPK)
}
`