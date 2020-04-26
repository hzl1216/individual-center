'use strict';

module.exports = {
  IndividualNotFound: {
    id: 2001,
    message: '个体不存在',
    status: 404
  },
  ClinicalNotFound: {
    id: 2002,
    message: '临床记录不存在',
    status: 404
  },
  DataNotFound: {
    id: 2003,
    message: '数据不存在',
    status: 404
  },
  TissueNotFound: {
    id: 2004,
    message: '组织不存在',
    status: 404
  },
  FileNotFound: {
    id: 2005,
    message: '文件不存在',
    status: 404
  },
  IndividualExist: {
    id: 20001,
    message: '个体已经存在',
    status: 403
  },
  ClinicalExist: {
    id: 20002,
    message: '临床记录已经存在',
    status: 403
  },
  TissueExist: {
    id: 20003,
    message: '组织已经存在',
    status: 403
  },
  DataExist: {
    id: 20004,
    message: '数据已经存在',
    status: 403
  },
};
