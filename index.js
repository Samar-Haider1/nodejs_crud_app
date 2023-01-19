// import {fileTypeFromFile} from 'file-type';
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var oracleConnect = require("./src/config/oracleConnect")

// const fileTypeFromFile = require("file-type");

// var client = require("./connection.js");
var oracledb = require("oracledb");



const port = 4000;

app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header(
    // "Access-Control-Allow-Headers",
    // "Origin, X-Requested-With, Content-Type, Accept"
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(require('./src/router'));


app.get("/", (req, res) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  res.send("Hello World!");
});


app.get("/mypost", async (req, res) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   console.log(req.body);
  // console.log(req.headers);
  // console.log(req.body);
  var connectmeToORacle = await oracleConnect.oraclePromisify();
  // var connectmeToORacle = await oraclePromisify_update();
  if(connectmeToORacle.status!=="00"){
    res.send("connection error");
  }else{
    console.log(JSON.stringify(connectmeToORacle));
    res.send(connectmeToORacle.rows[0][25].toLocaleString());
  }

  
  
});



// async function JsonWorking(sqlObject) {
//   return new Promise((resolve, reject) => {
//     for (var rowIndex = 0; rowIndex < sqlObject.rows.length; rowIndex++) {
//       console.log(sqlObject.rows[rowIndex]);
//     }
//     resolve();
//   });

//   // console.log(tableColumnHeading);
// }

app.patch("/mypatch", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  //   console.log(req.body);
  console.log(req.headers);
  console.log(req.body);

  res.send("Hello patch!");
});

app.post("/writetoes", (req, res) => {
  // console.log(req.body);
  client.index(
    {
      index: "nodelog",
      body: {
        "@timestamp": new Date(),
        level: "INFO",
        message: "data message",
      },
    },
    function (err, resp, status) {
      console.log(JSON.stringify(resp));
    }
  );
  res.send(JSON.stringify({ tag: "Hello patch!" }));
});

async function oraclePromisify() {
  return new Promise(async (resolve, reject) => {
    let connection = null;
    try {
      connection = await oracledb.getConnection({
        user: "btuser",
        password: "btuser",
        connectString:
          "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1522))(CONNECT_DATA =(SID= XE)))",
      });
      console.log("Successfully connected to Oracle!");
      oracledb.fetchAsString = [oracledb.CLOB];
      result = await connection.execute(
        // `select * from USER_REQUEST where id = 'c6a65e8d-f743-4812-bef7-6edad56c4580'`
        `select * from USER_REQUEST where id = :id `,
        ["c6a65e8d-f743-4812-bef7-6edad56c4580"],
        [
          {
            splitResults: true, //True to enable to split the results into bulks, each bulk will invoke the provided callback (last callback invocation will have empty results)
            bulkRowsAmount: 100, //The amount of rows to fetch (for splitting results, that is the max rows that the callback will get for each callback invocation)
          },
          {
            fetchInfo: {
              USER_REQUEST: { type: oracledb.OBJECT },
            },
          },
          {
            outFormat: oracledb.OBJECT,
          },
        ]
      );
      // console.log(JSON.stringify(result));
      resolve(result);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      if (connection) {
        try {
          console.log("connection was successfull");
          await connection.close();
        } catch (err) {
          console.log("Error when closing the database connection: ", err);
        }
      }
    }
  });
}


async function oraclePromisify_update() {
  return new Promise(async (resolve, reject) => {
    let connection = null;
    try {
      connection = await oracledb.getConnection({
        user: "btuser",
        password: "btuser",
        connectString:
          "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1522))(CONNECT_DATA =(SID= XE)))",
      });
      console.log("Successfully connected to Oracle!");
      oracledb.fetchAsString = [oracledb.CLOB];

      var uerRequestValueTOUpdate = '"ccBasicInformation":{"requestLimit":"10000K","creditCardType":"NONE","monthlySalary":"a","otherIncome":"a","liabilityType":"NONE","nameOfBankOrDf":"a","approvedLimit":"a"}"'
      result = await connection.execute(
        // `select * from USER_REQUEST where id = 'c6a65e8d-f743-4812-bef7-6edad56c4580'`
        `update USER_REQUEST set USER_REQUEST= :uerRequestValueTOUpdate where id = :id `,
        [uerRequestValueTOUpdate, "c6a65e8d-f743-4812-bef7-6edad56c4580" ],
        [
          {
            splitResults: true, //True to enable to split the results into bulks, each bulk will invoke the provided callback (last callback invocation will have empty results)
            bulkRowsAmount: 100, //The amount of rows to fetch (for splitting results, that is the max rows that the callback will get for each callback invocation)
          },
          {
            fetchInfo: {
              USER_REQUEST: { type: oracledb.OBJECT },
            },
          },
          {
            outFormat: oracledb.OBJECT,
          },
        ]
      );

      connection.commit();
      // console.log(JSON.stringify(result));
      resolve(result);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      if (connection) {
        try {
          console.log("connection was successfull");
          await connection.close();
        } catch (err) {
          console.log("Error when closing the database connection: ", err);
        }
      }
    }
  });
}



async function connectToORacle() {}

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  var now = new Date().toLocaleString(); //.toJSON();

  let myString = {
    data: '[{"unqRecId":"123","assetNumber":"12345","serialNumber":"78601","description":"new asset","majorCategory":"Computer","minorCategory":"Laptop","purchaseDate":1653305082440,"purchaseValueRs":500,"locationCode":102,"branchName":"okara branch","branchCode":"L0902","qtyAsFar":20,"status":1,"dateCreated":1653305082440,"lastUpdated":1653305093362,"createdBy":1,"modifiedBy":1,"wdv":200},{"unqRecId":"723b625a-824f-4c59-ad49-a908805e6bd3","assetNumber":"12345","serialNumber":"78601","description":"new asset","majorCategory":"Computer","minorCategory":"Laptop","purchaseDate":1653305237424,"purchaseValueRs":500,"locationCode":102,"branchName":"okara branch","branchCode":"L0902","qtyAsFar":20,"status":1,"dateCreated":1653305237424,"lastUpdated":1653305238998,"createdBy":1,"modifiedBy":1,"wdv":200},{"unqRecId":"32b8f009-8f94-4fd3-8ff2-1127a318436a","assetNumber":"12345","serialNumber":"78601","description":"new asset","majorCategory":"Computer","minorCategory":"Laptop","purchaseDate":1653309918021,"purchaseValueRs":500,"locationCode":102,"branchName":"okara branch","branchCode":"L0902","qtyAsFar":20,"status":1,"dateCreated":1653309918021,"lastUpdated":1653309918067,"createdBy":1,"modifiedBy":1,"wdv":200},{"unqRecId":"f498e9d7-e7d9-4bd2-b863-8e24948d8e2e","assetNumber":"12345","serialNumber":"78601","description":"new asset","majorCategory":"Computer","minorCategory":"Laptop","purchaseDate":1653311277281,"purchaseValueRs":500,"locationCode":102,"branchName":"okara branch","branchCode":"L0902","qtyAsFar":20,"status":1,"dateCreated":1653311277281,"lastUpdated":1653311281493,"createdBy":1,"modifiedBy":1,"wdv":200},{"unqRecId":"51636b79-6b5e-46a3-b972-a60282ca1b12","assetNumber":"1234","serialNumber":"1234","description":"1234","majorCategory":"1234","minorCategory":"1234","purchaseDate":1653377759061,"purchaseValueRs":50,"locationCode":102,"branchName":"okara branch","branchCode":"L0902","qtyAsFar":20,"status":1,"dateCreated":1653377759061,"lastUpdated":1653377759122,"createdBy":1,"modifiedBy":1,"wdv":50},{"unqRecId":"e686dda8-59c6-4b4f-8874-e1201b4d8147","assetNumber":"112233","serialNumber":"78601","description":"new asset","majorCategory":"Computer","minorCategory":"Laptop","purchaseDate":1653305082440,"purchaseValueRs":500,"locationCode":102,"branchName":"okara branch","branchCode":"L0902","qtyAsFar":20,"status":1,"dateCreated":1653305082440,"lastUpdated":1653379587257,"createdBy":1,"modifiedBy":1,"wdv":200},{"unqRecId":"4340-6013-L0902-1","assetNumber":"4340","serialNumber":"CNC2Y00693","description":"PAYMENT MADE ON A/C OF PURCHASE 01 PCS HP LJ 2035N PRINTER FOR OKARA BR TO BUSIN","majorCategory":"Computer","minorCategory":"Printer","purchaseDate":1248976800000,"purchaseValueRs":31900,"locationCode":6013,"branchName":"Okara","branchCode":"L0902","qtyAsFar":1,"status":1,"dateCreated":1653305082440,"lastUpdated":1653305093362,"createdBy":14178,"modifiedBy":1,"wdv":200}]',
  };

  // let exceptiondata =
  //   '{"cause":{"cause":null,"stackTrace":[{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"prepareSuccessResponseAndReturn","fileName":"CustomResponse.java","lineNumber":28,"nativeMethod":false,"className":"com.jsbank.far.utils.CustomResponse"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"getAllAssetAddedByBranch","fileName":"FarController.java","lineNumber":197,"nativeMethod":false,"className":"com.jsbank.far.controllers.FarController"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke0","fileName":"NativeMethodAccessorImpl.java","lineNumber":-2,"nativeMethod":true,"className":"jdk.internal.reflect.NativeMethodAccessorImpl"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke","fileName":"NativeMethodAccessorImpl.java","lineNumber":77,"nativeMethod":false,"className":"jdk.internal.reflect.NativeMethodAccessorImpl"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke","fileName":"DelegatingMethodAccessorImpl.java","lineNumber":43,"nativeMethod":false,"className":"jdk.internal.reflect.DelegatingMethodAccessorImpl"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke","fileName":"Method.java","lineNumber":568,"nativeMethod":false,"className":"java.lang.reflect.Method"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doInvoke","fileName":"InvocableHandlerMethod.java","lineNumber":197,"nativeMethod":false,"className":"org.springframework.web.method.support.InvocableHandlerMethod"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invokeForRequest","fileName":"InvocableHandlerMethod.java","lineNumber":141,"nativeMethod":false,"className":"org.springframework.web.method.support.InvocableHandlerMethod"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invokeAndHandle","fileName":"ServletInvocableHandlerMethod.java","lineNumber":106,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invokeHandlerMethod","fileName":"RequestMappingHandlerAdapter.java","lineNumber":894,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"handleInternal","fileName":"RequestMappingHandlerAdapter.java","lineNumber":808,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"handle","fileName":"AbstractHandlerMethodAdapter.java","lineNumber":87,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doDispatch","fileName":"DispatcherServlet.java","lineNumber":1063,"nativeMethod":false,"className":"org.springframework.web.servlet.DispatcherServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doService","fileName":"DispatcherServlet.java","lineNumber":963,"nativeMethod":false,"className":"org.springframework.web.servlet.DispatcherServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"processRequest","fileName":"FrameworkServlet.java","lineNumber":1006,"nativeMethod":false,"className":"org.springframework.web.servlet.FrameworkServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doGet","fileName":"FrameworkServlet.java","lineNumber":898,"nativeMethod":false,"className":"org.springframework.web.servlet.FrameworkServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"HttpServlet.java","lineNumber":626,"nativeMethod":false,"className":"javax.servlet.http.HttpServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"FrameworkServlet.java","lineNumber":883,"nativeMethod":false,"className":"org.springframework.web.servlet.FrameworkServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"HttpServlet.java","lineNumber":733,"nativeMethod":false,"className":"javax.servlet.http.HttpServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":227,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"WsFilter.java","lineNumber":53,"nativeMethod":false,"className":"org.apache.tomcat.websocket.server.WsFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"LogbookFilter.java","lineNumber":71,"nativeMethod":false,"className":"org.zalando.logbook.servlet.LogbookFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"HttpFilter.java","lineNumber":31,"nativeMethod":false,"className":"org.zalando.logbook.servlet.HttpFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"RequestContextFilter.java","lineNumber":100,"nativeMethod":false,"className":"org.springframework.web.filter.RequestContextFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"FormContentFilter.java","lineNumber":93,"nativeMethod":false,"className":"org.springframework.web.filter.FormContentFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"TracingFilter.java","lineNumber":89,"nativeMethod":false,"className":"org.springframework.cloud.sleuth.instrument.web.servlet.TracingFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"TraceWebServletConfiguration.java","lineNumber":114,"nativeMethod":false,"className":"org.springframework.cloud.sleuth.autoconfig.instrument.web.LazyTracingFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"WebMvcMetricsFilter.java","lineNumber":96,"nativeMethod":false,"className":"org.springframework.boot.actuate.metrics.web.servlet.WebMvcMetricsFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"CharacterEncodingFilter.java","lineNumber":201,"nativeMethod":false,"className":"org.springframework.web.filter.CharacterEncodingFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardWrapperValve.java","lineNumber":202,"nativeMethod":false,"className":"org.apache.catalina.core.StandardWrapperValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardContextValve.java","lineNumber":97,"nativeMethod":false,"className":"org.apache.catalina.core.StandardContextValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"AuthenticatorBase.java","lineNumber":542,"nativeMethod":false,"className":"org.apache.catalina.authenticator.AuthenticatorBase"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardHostValve.java","lineNumber":143,"nativeMethod":false,"className":"org.apache.catalina.core.StandardHostValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"ErrorReportValve.java","lineNumber":92,"nativeMethod":false,"className":"org.apache.catalina.valves.ErrorReportValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardEngineValve.java","lineNumber":78,"nativeMethod":false,"className":"org.apache.catalina.core.StandardEngineValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"CoyoteAdapter.java","lineNumber":357,"nativeMethod":false,"className":"org.apache.catalina.connector.CoyoteAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"Http11Processor.java","lineNumber":374,"nativeMethod":false,"className":"org.apache.coyote.http11.Http11Processor"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"process","fileName":"AbstractProcessorLight.java","lineNumber":65,"nativeMethod":false,"className":"org.apache.coyote.AbstractProcessorLight"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"process","fileName":"AbstractProtocol.java","lineNumber":893,"nativeMethod":false,"className":"org.apache.coyote.AbstractProtocol$ConnectionHandler"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doRun","fileName":"NioEndpoint.java","lineNumber":1707,"nativeMethod":false,"className":"org.apache.tomcat.util.net.NioEndpoint$SocketProcessor"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"run","fileName":"SocketProcessorBase.java","lineNumber":49,"nativeMethod":false,"className":"org.apache.tomcat.util.net.SocketProcessorBase"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"runWorker","fileName":"ThreadPoolExecutor.java","lineNumber":1136,"nativeMethod":false,"className":"java.util.concurrent.ThreadPoolExecutor"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"run","fileName":"ThreadPoolExecutor.java","lineNumber":635,"nativeMethod":false,"className":"java.util.concurrent.ThreadPoolExecutor$Worker"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"run","fileName":"TaskThread.java","lineNumber":61,"nativeMethod":false,"className":"org.apache.tomcat.util.threads.TaskThread$WrappingRunnable"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"run","fileName":"Thread.java","lineNumber":833,"nativeMethod":false,"className":"java.lang.Thread"}],"message":"Cannot invoke \\"Object.equals(Object)\\" because \\"data\\" is null","suppressed":[],"localizedMessage":"Cannot invoke \\"Object.equals(Object)\\" because \\"data\\" is null"},"stackTrace":[{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"prepareSuccessResponseAndReturn","fileName":"CustomResponse.java","lineNumber":38,"nativeMethod":false,"className":"com.jsbank.far.utils.CustomResponse"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"getAllAssetAddedByBranch","fileName":"FarController.java","lineNumber":197,"nativeMethod":false,"className":"com.jsbank.far.controllers.FarController"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke0","fileName":"NativeMethodAccessorImpl.java","lineNumber":-2,"nativeMethod":true,"className":"jdk.internal.reflect.NativeMethodAccessorImpl"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke","fileName":"NativeMethodAccessorImpl.java","lineNumber":77,"nativeMethod":false,"className":"jdk.internal.reflect.NativeMethodAccessorImpl"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke","fileName":"DelegatingMethodAccessorImpl.java","lineNumber":43,"nativeMethod":false,"className":"jdk.internal.reflect.DelegatingMethodAccessorImpl"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"invoke","fileName":"Method.java","lineNumber":568,"nativeMethod":false,"className":"java.lang.reflect.Method"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doInvoke","fileName":"InvocableHandlerMethod.java","lineNumber":197,"nativeMethod":false,"className":"org.springframework.web.method.support.InvocableHandlerMethod"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invokeForRequest","fileName":"InvocableHandlerMethod.java","lineNumber":141,"nativeMethod":false,"className":"org.springframework.web.method.support.InvocableHandlerMethod"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invokeAndHandle","fileName":"ServletInvocableHandlerMethod.java","lineNumber":106,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invokeHandlerMethod","fileName":"RequestMappingHandlerAdapter.java","lineNumber":894,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"handleInternal","fileName":"RequestMappingHandlerAdapter.java","lineNumber":808,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"handle","fileName":"AbstractHandlerMethodAdapter.java","lineNumber":87,"nativeMethod":false,"className":"org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doDispatch","fileName":"DispatcherServlet.java","lineNumber":1063,"nativeMethod":false,"className":"org.springframework.web.servlet.DispatcherServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doService","fileName":"DispatcherServlet.java","lineNumber":963,"nativeMethod":false,"className":"org.springframework.web.servlet.DispatcherServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"processRequest","fileName":"FrameworkServlet.java","lineNumber":1006,"nativeMethod":false,"className":"org.springframework.web.servlet.FrameworkServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doGet","fileName":"FrameworkServlet.java","lineNumber":898,"nativeMethod":false,"className":"org.springframework.web.servlet.FrameworkServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"HttpServlet.java","lineNumber":626,"nativeMethod":false,"className":"javax.servlet.http.HttpServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"FrameworkServlet.java","lineNumber":883,"nativeMethod":false,"className":"org.springframework.web.servlet.FrameworkServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"HttpServlet.java","lineNumber":733,"nativeMethod":false,"className":"javax.servlet.http.HttpServlet"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":227,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"WsFilter.java","lineNumber":53,"nativeMethod":false,"className":"org.apache.tomcat.websocket.server.WsFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"LogbookFilter.java","lineNumber":71,"nativeMethod":false,"className":"org.zalando.logbook.servlet.LogbookFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"HttpFilter.java","lineNumber":31,"nativeMethod":false,"className":"org.zalando.logbook.servlet.HttpFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"RequestContextFilter.java","lineNumber":100,"nativeMethod":false,"className":"org.springframework.web.filter.RequestContextFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"FormContentFilter.java","lineNumber":93,"nativeMethod":false,"className":"org.springframework.web.filter.FormContentFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"TracingFilter.java","lineNumber":89,"nativeMethod":false,"className":"org.springframework.cloud.sleuth.instrument.web.servlet.TracingFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"TraceWebServletConfiguration.java","lineNumber":114,"nativeMethod":false,"className":"org.springframework.cloud.sleuth.autoconfig.instrument.web.LazyTracingFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"WebMvcMetricsFilter.java","lineNumber":96,"nativeMethod":false,"className":"org.springframework.boot.actuate.metrics.web.servlet.WebMvcMetricsFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilterInternal","fileName":"CharacterEncodingFilter.java","lineNumber":201,"nativeMethod":false,"className":"org.springframework.web.filter.CharacterEncodingFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"OncePerRequestFilter.java","lineNumber":119,"nativeMethod":false,"className":"org.springframework.web.filter.OncePerRequestFilter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"internalDoFilter","fileName":"ApplicationFilterChain.java","lineNumber":189,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doFilter","fileName":"ApplicationFilterChain.java","lineNumber":162,"nativeMethod":false,"className":"org.apache.catalina.core.ApplicationFilterChain"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardWrapperValve.java","lineNumber":202,"nativeMethod":false,"className":"org.apache.catalina.core.StandardWrapperValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardContextValve.java","lineNumber":97,"nativeMethod":false,"className":"org.apache.catalina.core.StandardContextValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"AuthenticatorBase.java","lineNumber":542,"nativeMethod":false,"className":"org.apache.catalina.authenticator.AuthenticatorBase"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardHostValve.java","lineNumber":143,"nativeMethod":false,"className":"org.apache.catalina.core.StandardHostValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"ErrorReportValve.java","lineNumber":92,"nativeMethod":false,"className":"org.apache.catalina.valves.ErrorReportValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"invoke","fileName":"StandardEngineValve.java","lineNumber":78,"nativeMethod":false,"className":"org.apache.catalina.core.StandardEngineValve"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"CoyoteAdapter.java","lineNumber":357,"nativeMethod":false,"className":"org.apache.catalina.connector.CoyoteAdapter"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"service","fileName":"Http11Processor.java","lineNumber":374,"nativeMethod":false,"className":"org.apache.coyote.http11.Http11Processor"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"process","fileName":"AbstractProcessorLight.java","lineNumber":65,"nativeMethod":false,"className":"org.apache.coyote.AbstractProcessorLight"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"process","fileName":"AbstractProtocol.java","lineNumber":893,"nativeMethod":false,"className":"org.apache.coyote.AbstractProtocol$ConnectionHandler"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"doRun","fileName":"NioEndpoint.java","lineNumber":1707,"nativeMethod":false,"className":"org.apache.tomcat.util.net.NioEndpoint$SocketProcessor"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"run","fileName":"SocketProcessorBase.java","lineNumber":49,"nativeMethod":false,"className":"org.apache.tomcat.util.net.SocketProcessorBase"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"runWorker","fileName":"ThreadPoolExecutor.java","lineNumber":1136,"nativeMethod":false,"className":"java.util.concurrent.ThreadPoolExecutor"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"run","fileName":"ThreadPoolExecutor.java","lineNumber":635,"nativeMethod":false,"className":"java.util.concurrent.ThreadPoolExecutor$Worker"},{"classLoaderName":"app","moduleName":null,"moduleVersion":null,"methodName":"run","fileName":"TaskThread.java","lineNumber":61,"nativeMethod":false,"className":"org.apache.tomcat.util.threads.TaskThread$WrappingRunnable"},{"classLoaderName":null,"moduleName":"java.base","moduleVersion":"17.0.2","methodName":"run","fileName":"Thread.java","lineNumber":833,"nativeMethod":false,"className":"java.lang.Thread"}],"message":"java.lang.NullPointerException: Cannot invoke \\"Object.equals(Object)\\" because \\"data\\" is null","suppressed":[],"localizedMessage":"java.lang.NullPointerException: Cannot invoke \\"Object.equals(Object)\\" because \\"data\\" is null"}';
  // console.log(now);
  // console.log(JSON.parse(myString.data));
  // console.log(JSON.parse(exceptiondata));


  // import {fileTypeFromFile} from 'file-type';

  // console.log(await fileTypeFromFile.fileTypeFromFile('./cnic.png'));



});
