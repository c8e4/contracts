export const hodlContract = `
{
    // Constants
    // $contractDevPK
    // $oraclePoolNFT = "0fb1eca4646950743bc5a8c341c16871a0ad9b4077e3b276bf93855d51a042d1"
    
    // Context vars set by the UI developer building the HODLBOX mint transaction
    val optUIFeePK              = getVar[SigmaProp](0)

    val hodlerPK                = SELF.R5[SigmaProp].get
    val hodlTargetRate          = SELF.R6[Long].get
    val maxHeight               = SELF.R7[Int].get

    val totalLockedNanoErg            = SELF.value
    val fees: Coll[(SigmaProp, BigInt)] = {
        val feeDenom = 100000L
        val devFee   = 400L         // 0.4%
        // If ui fee is defined, then we add an additional 0.5% fee
        if(optUIFeePK.isDefined){
            val uiFee = 600L        // 0.6%

            Coll(
                 ($contractDevPK, (devFee.toBigInt * totalLockedNanoErg.toBigInt) / feeDenom.toBigInt),
                 (optUIFeePK.get, (uiFee.toBigInt * totalLockedNanoErg.toBigInt) / feeDenom.toBigInt)
            )
        }else{
            Coll( ($contractDevPK, (devFee.toBigInt * totalLockedNanoErg.toBigInt) / feeDenom.toBigInt) )
        }
    }

    // Ensure that correct fee output boxes exist
    val feesPaid = {
        val devFeesPaid = {
            if(fees(0)._2 > 0){ // Dev fee is greater than 0
                val devOutput   = OUTPUTS(2)
                allOf(
                    Coll(
                        devOutput.propositionBytes   == fees(0)._1.propBytes,
                        devOutput.value.toBigInt     == fees(0)._2
                    )
                )
            }else{
                true // do nothing if dev fee doesn't add up greater than 0, prevents errors on low value bonds
            }
        }

        val uiFeesPaid = {
            if(optUIFeePK.isDefined){
                if(fees(1)._2 > 0){ // UI fee is greater than 0
                    val uiOutput    = OUTPUTS(3)
                    allOf(
                        Coll(
                            uiOutput.propositionBytes   == fees(1)._1.propBytes,
                            uiOutput.value.toBigInt     == fees(1)._2
                        )
                    )
                }else{
                    true // do nothing if ui fee doesn't end up greater than 0, prevents errors on low value bonds
                }
            }else{
                true // if ui fee isn't defined, then default to true.
            }
        }
        devFeesPaid && uiFeesPaid
    }

    val feesTotal = {
        if(optUIFeePK.isDefined){
            fees(0)._2 + fees(1)._2
        }else{
            fees(0)._2
        }
    }

    val repaymentNanoErg = totalLockedNanoErg - feesTotal

    val fundsReturned = {
        OUTPUTS(0).propositionBytes == hodlerPK.propBytes && OUTPUTS(0).value == repaymentNanoErg
    }

    val maxHeightReached = {
        maxHeight <= HEIGHT
    }

    val priceTargetReached = {
        if (CONTEXT.dataInputs.size > 0) {
            // validate Oracle box
            val rateBox = CONTEXT.dataInputs(0)
            val validDataInput = rateBox.tokens(0)._1 == $oraclePoolNFT
            val currentRate = rateBox.R4[Long].get

            // check if the price reached target
            val targetPriceReached = currentRate <= hodlTargetRate

            validDataInput && targetPriceReached
        } else {
            false
        }
    }

    if(priceTargetReached || maxHeightReached){
        sigmaProp(fundsReturned && feesPaid)
    } else {
        sigmaProp(false)
    }
}
`