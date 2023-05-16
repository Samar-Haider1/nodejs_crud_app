async function ebAccountOpening(queryParams) {
    var returnObject = { status: "", data: "", message: "" };
    return new Promise(async (resolve, reject) => {
        // try {
        //     let response ={} 
        //     response = await queryManager.loginUser(queryParams);
        //     const item = response.data[0]
        //         if ( response.data.length > 0) {

        //             res = await queryManager.sessionEntriesCount();
        //             const obj = {...queryParams, ID: res?.data[0]?.TOTAL_ENTRIES + 1, TOKEN: token, CREATED_DATETIME: date, IS_NEW_USER: item.IS_NEW_USER}
        //             const resp = await knex('JWT_USER').insert(obj)
        //             if (resp===1) {
        //                 returnObject.status = "00";
        //                 returnObject.message = "Login Success";
        //                 const obj = item.IS_NEW_USER === 1 ? { isChangePsd: true } : {}
        //                 returnObject.data = { TOKEN: token, ...obj }

        //             } else {
        //                 returnObject.status = "01";
        //                 returnObject.message = "Something Went Wrong";
        //                 returnObject.data = {}
        //             }
        //         } else {
        //             returnObject.status = "01";
        //             returnObject.message = "Login Failed";
        //             returnObject.data = {}
        //         }
        //         resolve(returnObject);

        // } catch (err) {
        //     returnObject.status = "99";
        //     returnObject.message = "Something Went Wrong ";
        //     resolve(returnObject);

        // } 
    })
}