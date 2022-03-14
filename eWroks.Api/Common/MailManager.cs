using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace eWroks.Api.Common
{
    public class MailManager
    {
        /// <summary>
        /// 메일 발송 타입 설정
        /// </summary>
        public enum MailBodyType
        {
            Text = 1,
            Html = 2
        }

        #region Biz 단에서 메일 보내기 : 구동환 1;
        // Biz 단에서 메일 보내기 : 구동환
        public eWorksResult SendMail(string mailFrom, string[] mailTo, string[] mailCC, string[] mailBCC,
                                    string mailSubject, string mailBody, MailBodyType mailBodyType, string[] fileUpload)
        {
            return MailSend(mailFrom, mailTo, mailCC, mailBCC,
                                     mailSubject, mailBody, mailBodyType, fileUpload);
        }
        /// <summary>
        /// SendMail - to, cc, bcc, 첨부파일 가능
        /// </summary>
        /// <param name="mailFrom">보내는 Email</param>
        /// <param name="mailTo">받는 Email (배열)</param>
        /// <param name="mailCC">참조 (배열)</param>
        /// <param name="mailBCC">숨은 참조 (배열)</param>
        /// <param name="mailSubject">제목</param>
        /// <param name="mailBody">내용</param>
        /// <param name="mailBodyType">Html 0r Text</param>
        /// <param name="fileUpload">첨부파일</param> 
        /// <returns></returns>
        public eWorksResult MailSend(string mailFrom, string[] mailTo, string[] mailCC, string[] mailBCC,
                                    string mailSubject, string mailBody, MailBodyType mailBodyType, string[] fileUpload)
        {
            eWorksResult result = new eWorksResult();

            #region == 메일기본 객체 선언 ==
            MailMessage oMailMessage = null; // 메일메세지 객체 선언
            SmtpClient oSmtpMail = null;     // 메일SMTP 객체 선언
            #endregion == 메일기본 객체 선언 ==

            #region == FileUpload객체를 사용할때 변수 ==
            string strFileName = string.Empty;      // 순수한 파일명
            string strFullfileName = string.Empty;  // 전체경로 및 파일명

            string[] removeFileName = new string[fileUpload.Length];
            #endregion == FileUpload객체를 사용할때 변수 ==

            try
            {
                #region == 기본 메일 객체 생성 & 메일 주소 설정 ==
                // 메세지 객체 생성
                oMailMessage = new MailMessage();

                // 메일주소|표시이름
                string[] strArrMailFrom = StringManager.Split(mailFrom, "|");

                if (strArrMailFrom.Length == 1)
                {
                    // 보내는 Email 주소 
                    oMailMessage.From = new MailAddress(mailFrom);
                }
                else
                {
                    oMailMessage.From = new MailAddress(strArrMailFrom[0], strArrMailFrom[1]);
                }

                // 받는 메일 주소
                if (mailTo.Length > 0)
                {
                    for (int i = 0; i < mailTo.Length; i++)
                    {
                        if (mailTo[i].Trim() != "")
                        {
                            // 받는 Email 주소
                            oMailMessage.To.Add(mailTo[i].Trim());
                        }
                    }
                }

                // 참조 Email 주소 
                if (mailCC != null && mailCC.Length > 0)
                {
                    for (int i = 0; i < mailCC.Length; i++)
                    {
                        if (mailCC[i].Trim() != "")
                        {
                            // 참조 Email 주소
                            oMailMessage.CC.Add(mailCC[i].Trim());
                        }
                    }
                }

                // 숨은 참조 Email 주소
                if (mailBCC != null && mailBCC.Length > 0)
                {
                    for (int i = 0; i < mailBCC.Length; i++)
                    {
                        if (mailBCC[i].Trim() != "")
                        {
                            // 숨은 참조 Email 주소
                            oMailMessage.Bcc.Add(mailBCC[i].Trim());
                        }
                    }
                }

                // 메일 내용 HTML여부 
                oMailMessage.IsBodyHtml = mailBodyType.Equals(MailBodyType.Html) ? true : false;
                oMailMessage.Subject = mailSubject;
                oMailMessage.Body = mailBody;

                #endregion == 기본 메일 객체 생성 & 메일 주소 설정 ==


                #region == FileUpload객체로 첨부파일 추가 ==
                //// 파입업로드 객체에 파일을 지정하였다면 
                //// 파일을 업로드 하고 첨부 파일에 추가 합니다.
                //if (fileUpload != null)
                //{

                //    if (fileUpload.Count > 0)
                //    {
                //        for (int i = 0; i < fileUpload.Count; i++)
                //        {
                //            HttpPostedFile hpf = fileUpload[i];
                //            if (hpf.ContentLength > 0)
                //            {
                //                strFullfileName = System.Web.HttpContext.Current.Server.MapPath("~/Uploads/") + System.IO.Path.GetFileName(hpf.FileName);

                //                hpf.SaveAs(strFullfileName);

                //                strFileName = System.IO.Path.GetFileName(hpf.FileName);

                //                Attachment oAttachment = new Attachment(strFullfileName);

                //                // fileName : 메일에서 보이게 되는 첨부파일명
                //                oAttachment.Name = strFileName;

                //                // 메세지에 파일을 첨부한다.
                //                oMailMessage.Attachments.Add(oAttachment);
                //                removeFileName[i] = strFullfileName;
                //            }
                //        }

                //    }
                //}

                #endregion == FileUpload객체로 첨부파일 추가 ==

                #region == SMPT객체 생성 및 Host, Port 지정 ==
                // SMTP메일 객체 생성
                oSmtpMail = new SmtpClient();

                // SMTP메일 서버를 설정
                oSmtpMail.Host = eWorksConfig.smtpServer;
                oSmtpMail.Port = eWorksConfig.smtpPort;

                // 메일발송 합니다.
                oSmtpMail.Send(oMailMessage);
                #endregion == SMPT객체 생성 및 Host, Port 지정 ==

                result.OV_RTN_CODE = 0;
                result.OV_RTN_MSG = "발송 성공";
            }
            catch (Exception ex)
            {
                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = "발송 실패 : " + ex.Message;
            }
            finally
            {
                // 메세지 객체를 해제합니다.
                oMailMessage.Dispose();
            }

            return result;
        }
        #endregion


        #region Biz 단에서 메일 보내기 : 구동환 2 (첨부파일);
        // Biz 단에서 메일 보내기 : 구동환
        public eWorksResult SendMail_AttachFile(string mailFrom, string[] mailTo, string[] mailCC, string[] mailBCC,
                                    string mailSubject, string mailBody, MailBodyType mailBodyType, Attachment[] oAttachments)
        {
            return MailSend_AttachFile(mailFrom, mailTo, mailCC, mailBCC,
                                     mailSubject, mailBody, mailBodyType, oAttachments);
        }
        /// <summary>
        /// SendMail - to, cc, bcc, 첨부파일 가능
        /// </summary>
        /// <param name="mailFrom">보내는 Email</param>
        /// <param name="mailTo">받는 Email (배열)</param>
        /// <param name="mailCC">참조 (배열)</param>
        /// <param name="mailBCC">숨은 참조 (배열)</param>
        /// <param name="mailSubject">제목</param>
        /// <param name="mailBody">내용</param>
        /// <param name="mailBodyType">Html 0r Text</param>
        /// <param name="fileUpload">첨부파일</param> 
        /// <returns></returns>
        public eWorksResult MailSend_AttachFile(string mailFrom, string[] mailTo, string[] mailCC, string[] mailBCC,
                                    string mailSubject, string mailBody, MailBodyType mailBodyType, Attachment[] oAttachments)
        {
            eWorksResult result = new eWorksResult();

            #region == 메일기본 객체 선언 ==
            MailMessage oMailMessage = null; // 메일메세지 객체 선언
            SmtpClient oSmtpMail = null;     // 메일SMTP 객체 선언
            #endregion == 메일기본 객체 선언 ==

            #region == FileUpload객체를 사용할때 변수 ==
            string strFileName = string.Empty;      // 순수한 파일명
            string strFullfileName = string.Empty;  // 전체경로 및 파일명
            FileInfo objFile = null;                // 파일객체

            #endregion == FileUpload객체를 사용할때 변수 ==

            try
            {
                #region == 기본 메일 객체 생성 & 메일 주소 설정 ==

                // 메세지 객체 생성
                oMailMessage = new MailMessage();

                // 메일주소|표시이름
                string[] strArrMailFrom = StringManager.Split(mailFrom, "|");

                if (strArrMailFrom.Length == 1)
                {
                    // 보내는 Email 주소 
                    oMailMessage.From = new MailAddress(mailFrom.Trim());
                }
                else
                {
                    oMailMessage.From = new MailAddress(strArrMailFrom[0], strArrMailFrom[1]);
                }

                // 받는 메일 주소
                if (mailTo.Length > 0)
                {
                    for (int i = 0; i < mailTo.Length; i++)
                    {
                        if (mailTo[i].Trim() != "")
                        {
                            // 받는 Email 주소
                            oMailMessage.To.Add(mailTo[i].Trim());
                        }
                    }
                }
                else
                {
                    throw new ApplicationException("받는 Email주소를 입력하여 주십시오.");
                }

                // 참조 Email 주소 
                if (mailCC != null && mailCC.Length > 0)
                {
                    for (int i = 0; i < mailCC.Length; i++)
                    {
                        if (mailCC[i].Trim() != "")
                        {
                            // 참조 Email 주소
                            oMailMessage.CC.Add(mailCC[i].Trim());
                        }
                    }
                }

                // 숨은 참조 Email 주소
                if (mailBCC != null && mailBCC.Length > 0)
                {
                    for (int i = 0; i < mailBCC.Length; i++)
                    {
                        if (mailBCC[i].Trim() != "")
                        {
                            // 숨은 참조 Email 주소
                            oMailMessage.Bcc.Add(mailBCC[i].Trim());
                        }
                    }
                }


                // 메일 제목
                if (mailSubject != "")
                {
                    oMailMessage.Subject = mailSubject;
                }
                else
                {
                    throw new ApplicationException("메일 제목을 입력하세요.");
                }

                // 메일 내용
                if (mailBody != "")
                {
                    oMailMessage.Body = mailBody;
                }
                else
                {
                    throw new ApplicationException("메일 내용을 입력하세요.");
                }

                // 메일 내용 HTML여부 
                oMailMessage.IsBodyHtml = mailBodyType.Equals(MailBodyType.Html) ? true : false;

                #endregion == 기본 메일 객체 생성 & 메일 주소 설정 ==


                #region == FileUpload객체로 첨부파일 추가 ==

                ////기본파일
                //if (sFilePath != "")
                //{
                //    FileInfo fFile = new FileInfo(sFilePath);

                //    strFullfileName = sFilePath;

                //    strFileName = Path.GetFileName(sFilePath);

                //    Attachment oAttachment = new Attachment(strFullfileName);

                //    // fileName : 메일에서 보이게 되는 첨부파일명
                //    oAttachment.Name = strFileName;

                //    // 메세지에 파일을 첨부한다.
                //    oMailMessage.Attachments.Add(oAttachment);
                //}

                // 파입업로드 객체에 파일을 지정하였다면 
                // 파일을 업로드 하고 첨부 파일에 추가 합니다.
                if (oAttachments != null)
                {
                    for (int i = 0; i < oAttachments.Length; i++)
                    {
                        // 메세지에 파일을 첨부한다.
                        oMailMessage.Attachments.Add(oAttachments[i]);
                    }
                }

                #endregion == FileUpload객체로 첨부파일 추가 ==


                #region == SMPT객체 생성 및 Host, Port 지정 ==
                // SMTP메일 객체 생성
                oSmtpMail = new SmtpClient();

                // SMTP메일 서버를 설정
                oSmtpMail.Host = eWorksConfig.smtpServer;
                oSmtpMail.Port = eWorksConfig.smtpPort;

                // 메일발송 합니다.
                oSmtpMail.Send(oMailMessage);
                #endregion == SMPT객체 생성 및 Host, Port 지정 ==

                result.OV_RTN_CODE = 0;
                result.OV_RTN_MSG = "발송 성공";

            }
            catch (Exception ex)
            {
                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = "발송 실패 : " + ex.Message;
            }
            finally
            {
                // 메세지 객체를 해제합니다.
                oMailMessage.Dispose();
            }

            return result;
        }

        #endregion
    }
}
