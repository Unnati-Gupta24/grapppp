import { argsToArgsConfig } from "graphql/type/definition";

const transactionResolver = {
    Query: {
        transactions: async(_,_,context)=>{
            try{
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = await context.getUser()._id;

                const transactions = await Transaction.find({userId});
                return transactions;
            }catch(err){
                console.error("Error in transactions query: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },
        transaction: async(_,{transactionId},)=>{
            try{
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            }catch(err){
                console.error("Error in transaction query: ", err);
                throw new Error(err.message || "Internal server error");
            }
        }
        //todo add categorystaticsquery
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
            try{
                const newTransaction = await Transaction({
                    ...input,
                    userId: context.getUser()._id
                });
                await newTransaction.save();
                return newTransaction;
            }catch(err){
                console.error("Error in createTransaction mutation: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },
        updateTransaction: async(_, {input}) => {
            try{
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});
                return updatedTransaction;
            }catch(err){
                console.error("Error in updateTransaction mutation: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },
        deleteTransaction: async(_, {transactionId}) => {
            try{
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            }catch(err){
                console.error("Error in deleteTransaction mutation: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },
    },
    //todo add transaction user relationship
};

export default transactionResolver;