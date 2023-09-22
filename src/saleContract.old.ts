export const saleContract = `
// SELF.R4(Long) : Sale price in nanoErg
// SELF.R5(Raw Address) : Seller Receive Address
// SELF.R6(Raw Address) : UI Fee Receive Address
// SELF.R7(GroupElement) : Public Key of Seller
{
	if (OUTPUTS.size > 2) { 
		val salePrice     = SELF.R4[Long].get
		val uiFee   = salePrice / 50
		val sellerAndFeesPaid = {
			allOf(
				Coll(
					OUTPUTS(0).value >= salePrice - uiFee, 
					OUTPUTS(0).propositionBytes == SELF.R5[Coll[Byte]].get,
					OUTPUTS(1).value >= uiFee, 
					OUTPUTS(1).propositionBytes == SELF.R6[Coll[Byte]].get,
					royaltyBox.id == SELF.tokens(0)._1
				)
			) 
		}

		sigmaProp(sellerAndFeesPaid) 
	} else {
		val pubKey = SELF.R7[GroupElement].get
		proveDlog(pubKey)
	}
}
`