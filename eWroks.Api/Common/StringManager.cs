using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eWroks.Api.Common
{
    public class StringManager
    {
        /// <summary>
        /// 
        /// </summary>
        public StringManager() { }

        #region == string, char, byte 상호 변환 ==

        /// <summary>
        /// 문자열을 지정한 구분자로 잘라서 문자배열로 반환한다.
        /// </summary>
        /// <param name="data"></param>
        /// <param name="delimiters"></param>
        /// <returns></returns>
        public static string[] Split(string data, string delimiters)
        {
            System.Collections.ArrayList oAL = new System.Collections.ArrayList();
            int iStartIdx = 0;
            int iEndIdx = 0;
            while (true)
            {
                iEndIdx = data.IndexOf(delimiters, iStartIdx);
                if (iEndIdx == -1)
                {
                    oAL.Add(data.Substring(iStartIdx, data.Length - iStartIdx));
                    break;
                }
                else
                    oAL.Add(data.Substring(iStartIdx, iEndIdx - iStartIdx));
                iStartIdx = iEndIdx + delimiters.Length;
            }

            return (string[])oAL.ToArray(System.Type.GetType("System.String"));
        }

        /// <summary>
        /// 파일을 바이너리 형식으로 읽어 들여서 byte로 반환한다.
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public static byte[] ReadBinaryFile(string filePath)
        {
            int buffersize = 1024;

            System.IO.FileStream stream = new System.IO.FileStream(filePath, System.IO.FileMode.Open, System.IO.FileAccess.Read);
            System.IO.BinaryReader reader = new System.IO.BinaryReader(stream);

            long length = stream.Length;

            if (length == 0) return null;
            if (length > int.MaxValue)
                throw new System.Exception(int.MaxValue.ToString() + " Byte 이상의 파일은 이 기능의 범위를 벗어납니다.|^|");

            int step = Convert.ToInt32(length / buffersize);
            int mod = Convert.ToInt32(length % buffersize);
            long offset = 0;
            byte[] binary = new byte[length];
            int i = 0;
            byte[] buffer = new byte[buffersize];
            while (i++ < step)
            {
                reader.Read(buffer, 0, buffersize);
                buffer.CopyTo(binary, offset);
                offset += buffersize;
            }
            buffer = null;
            buffer = new byte[mod];
            reader.Read(buffer, 0, mod);
            buffer.CopyTo(binary, offset);

            reader.Close();
            stream.Close();

            return binary;
        }

        /// <summary>
        /// 이미지 객체를 Byte객체로 읽어 들여 byte로 반환한다.
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public static byte[] ReadImageFile(string filePath)
        {

            long imgLength = 0;
            int iBytesRead = 0;
            byte[] imgArr = null;
            System.IO.FileStream fs = null;
            System.IO.FileInfo fiImage = null;
            try
            {
                fiImage = new System.IO.FileInfo(filePath);
                imgLength = fiImage.Length;
                fs = new System.IO.FileStream(filePath, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.Read);
                imgArr = new byte[Convert.ToInt32(imgLength)];
                iBytesRead = fs.Read(imgArr, 0, Convert.ToInt32(imgLength));
            }
            finally
            {
                fs.Close();
            }
            return imgArr;
        }

        /// <summary>
        /// 바이너리(Byte)데이터를 읽어들여 캐릭터(char)배열로 반환한다.
        /// </summary>
        /// <param name="binaryData"></param>
        /// <returns></returns>
        public static char[] ByteArrayToCharArray(byte[] binaryData)
        {
            // Convert the binary input into Base64 UUEncoded output.
            // Each 3 byte sequence in the source data becomes a 4 byte
            // sequence in the character array. 
            long arrayLength = (long)((4.0d / 3.0d) * binaryData.Length);
            // If array length is not divisible by 4, go up to the next
            // multiple of 4.
            if (arrayLength % 4 != 0)
            {
                arrayLength += 4 - arrayLength % 4;
            }
            char[] base64CharArray = new char[arrayLength];
            try
            {
                System.Convert.ToBase64CharArray(binaryData,
                    0,
                    binaryData.Length,
                    base64CharArray,
                    0);
            }
            catch (System.ArgumentNullException)
            {
                throw new ArgumentNullException("Binary data array is null.");
            }
            catch (System.ArgumentOutOfRangeException)
            {
                throw new ArgumentNullException("Char Array is not large enough.");
            }
            return base64CharArray;
        }

        /// <summary>
        /// Base64문자배열을 읽어들여 byte로 반환한다.
        /// </summary>
        /// <param name="base64CharArray"></param>
        /// <returns></returns>
        public static byte[] CharArrayToByteArray(char[] base64CharArray)
        {
            byte[] binaryData;
            try
            {
                binaryData =
                    System.Convert.FromBase64CharArray(base64CharArray,
                    0,
                    base64CharArray.Length);
            }
            catch (System.ArgumentNullException)
            {
                throw new ArgumentNullException("Base 64 character array is null.");
            }
            catch (System.FormatException)
            {
                throw new FormatException("Base 64 Char Array length is not 4 or is not an even multiple of 4.");
            }

            return binaryData;
        }

        /// <summary>
        /// 일반문자열을 Hash Byte[]로 반환한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static byte[] Str2Hash(string data)
        {
            System.Text.UTF8Encoding oEncoding = new System.Text.UTF8Encoding();
            byte[] ba = oEncoding.GetBytes(data);

            System.Security.Cryptography.SHA1 sha = new System.Security.Cryptography.SHA1CryptoServiceProvider();
            byte[] baHash = sha.ComputeHash(ba);
            sha.Clear();

            return baHash;
        }

        /// <summary>
        /// 일반문자열을 암호화 문자열에 사용할 수 있는 16Byte로 변환하여 반환한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static byte[] Str2Key(string data)
        {
            System.Text.UTF8Encoding oEncoding = new System.Text.UTF8Encoding();
            byte[] ba = oEncoding.GetBytes(data);

            System.Security.Cryptography.SHA1 sha = new System.Security.Cryptography.SHA1CryptoServiceProvider();
            byte[] baHash = sha.ComputeHash(ba);
            sha.Clear();

            byte[] baReturn = new byte[16];
            for (int i = 0; i < 16; i++) baReturn[i] = baHash[i + 2];

            return baReturn;
        }

        #endregion == string char, byte 상호변환

        #region == Excel 또는 Text파일 -> DataSet으로 ==

        /// <summary>
        /// 고정길이로 구성된 텍스트파일을 읽어들여 DataSet으로 변환하여 줍니다.<para></para>
        /// 첫째줄을 DataSet Table의 컬럼명으로 지정할 수 있다.<para></para>
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="columnLengths"></param>
        /// <param name="headerVisible"></param>
        /// <returns></returns>
        public static DataSet TextFile2DataSet(string filePath, int[] columnLengths, bool headerVisible)
        {

            System.IO.StreamReader sr = null;
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            DataColumn col = null;
            DataRow oRow = null;


            try
            {

                sr = new System.IO.StreamReader(System.IO.File.OpenRead(filePath), System.Text.Encoding.GetEncoding(949));

                string line = string.Empty;
                Encoding en = Encoding.GetEncoding(949);

                int itotlen = 0;
                for (int i = 0; i < columnLengths.Length; i++)
                {
                    col = new DataColumn();
                    dt.Columns.Add(col);
                    itotlen += columnLengths[i];
                }

                byte[] ByteArray = null;
                int itag = 0;
                int irowcount = 1;
                string strMessage = string.Empty;
                while ((line = sr.ReadLine()) != null)
                {
                    ByteArray = new Byte[itotlen];

                    //					if(ByteArray.Length < en.GetBytes()
                    //					{
                    //					}

                    if (ByteArray.Length > en.GetByteCount(line))
                    {
                        strMessage = string.Format(
                            "데이터를 텍스트로 변환하지 못했습니다. \r\n{0} 번째 데이터열의 길이가 주어진 전체 길이보다 작습니다.|^|"
                            , irowcount.ToString());
                        throw new System.Exception(strMessage);

                    }
                    else if (ByteArray.Length < en.GetByteCount(line))
                    {
                        strMessage = string.Format(
                            "데이터를 텍스트로 변환하지 못했습니다. \r\n{0} 번째 데이터열의 길이가 주어진 전체 길이보다 큽니다. |^|"
                            , irowcount.ToString());
                        throw new System.Exception(strMessage);

                    }

                    en.GetBytes(line, 0, line.Length, ByteArray, 0);

                    // 새행 추가
                    oRow = dt.NewRow();
                    for (int j = 0; j < columnLengths.Length; j++)
                    {
                        if ((ByteArray.Length - itag) < columnLengths[j])
                        {
                            strMessage = string.Format(
                                "데이터를 텍스트로 변환하지 못했습니다. \r\n{0} 번째 데이터열의 {1} 번째 Data가 지정된 컬럼의 너비보다 작습니다. |^|"
                                , irowcount.ToString(), j.ToString());
                            throw new System.Exception(strMessage);
                        }
                        else
                        {
                            oRow[j] = en.GetString(ByteArray, itag, columnLengths[j]).TrimEnd('\0').Trim();
                            //								if((line.Length - itag)<columnLengths[j])
                            //									oRow[j] = line.Substring(itag,line.Length - itag);
                            //								else
                            //									oRow[j] = line.Substring(itag, columnLengths[j]);
                            itag += columnLengths[j];
                        }
                    }

                    dt.Rows.Add(oRow);
                    itag = 0;
                    irowcount++;
                }
                // 헤더포함 여부에 따라 
                if (headerVisible)
                {
                    string te = string.Empty;

                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        te = dt.Rows[0][i].ToString();
                        // 헤더가 포함 되었는데 똑같은 이름의 헤더일 경우 이를 처리
                        if (dt.Columns.Contains(te))
                        {
                            te = te + i;
                        }
                        dt.Columns[i].ColumnName = te;
                    }
                    dt.Rows[0].Delete();
                }
                ds.Tables.Add(dt);
            }
            finally
            {
                if (sr != null) sr.Close();
            }
            return ds;
        }

        /// <summary>
        /// 구분자를 사용한 텍스트파일을 읽어들여 DataSet으로 변환하여 준다.<para></para>
        /// 첫째줄을 DataSet Table의 컬럼명으로 지정할 수 있다.<para></para>
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="delimiter"></param>
        /// <param name="headerVisible"></param>
        /// <returns></returns>
        public static DataSet TextFile2DataSet(string filePath, string delimiter, bool headerVisible)
        {
            System.IO.StreamReader sr = null;
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            DataColumn col = null;
            DataRow oRow = null;
            try
            {
                sr = new System.IO.StreamReader(System.IO.File.OpenRead(filePath), Encoding.GetEncoding(949));
                string line = string.Empty;
                string[] strArrCols = null;
                bool flag = false;
                while ((line = sr.ReadLine()) != null)
                {
                    strArrCols = StringManager.Split(line, delimiter);

                    oRow = dt.NewRow();

                    for (int i = 0; i < strArrCols.Length; i++)
                    {
                        if (!flag)
                        {
                            col = new DataColumn();
                            dt.Columns.Add(col);
                        }

                        oRow[i] = strArrCols[i];

                    }

                    if (strArrCols.Length != (dt.Columns.Count))
                        throw new System.Exception("읽으려는 파일의 형식 길이가 일정하지 않습니다. |^|");

                    dt.Rows.Add(oRow);
                    flag = true;
                }

                // 헤더 포함 여부에 따라
                if (headerVisible)
                {
                    string te = string.Empty;
                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        te = dt.Rows[0][i].ToString();
                        // 헤더가 포함 되었는데 똑같은 이름의 헤더일 경우 이를 처리
                        if (dt.Columns.Contains(te))
                        {
                            te = te + i;
                        }
                        dt.Columns[i].ColumnName = te;
                    }
                    dt.Rows[0].Delete();
                }
                ds.Tables.Add(dt);
            }
            finally
            {
                if (sr != null) sr.Close();
            }
            return ds;
        }

        /// <summary>
        /// 엑셀파일을 읽어들여 데이타셋으로 반환한다.
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="headerVisible"></param>
        /// <returns></returns>
        public static DataSet Excel2DataSet(string filePath, bool headerVisible)
        {
            string strExcelConnectionString =
                String.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};Extended Properties=Excel 8.0;", filePath);

            OleDbConnection connExcel = new System.Data.OleDb.OleDbConnection(strExcelConnectionString);

            System.Data.DataTable dt = null;
            DataSet dsExcel = new DataSet();

            try
            {
                connExcel.Open();
                dt = connExcel.GetOleDbSchemaTable(System.Data.OleDb.OleDbSchemaGuid.Tables, new object[] { null, null, null, "Table" });

                string sheetName = dt.Rows[0]["Table_Name"].ToString();
                string strQry = "select * from [" + sheetName + "]";

                OleDbDataAdapter daExcel = new OleDbDataAdapter(strQry, connExcel);

                daExcel.Fill(dsExcel);

                // 
                if (headerVisible && dsExcel.Tables[0].Columns[0].ColumnName == "Column1")
                {
                    string te = string.Empty;
                    for (int i = 0; i < dsExcel.Tables[0].Columns.Count; i++)
                    {
                        te = dsExcel.Tables[0].Rows[0][i].ToString();
                        if (dt.Columns.Contains(te))
                        {
                            te = te + i;
                        }
                        dsExcel.Tables[0].Columns[i].ColumnName = te;
                    }
                    dsExcel.Tables[0].Rows[0].Delete();
                }
            }
            finally
            {
                if (connExcel.State != ConnectionState.Closed) connExcel.Close();
                if (dt != null) dt.Dispose();
            }

            return dsExcel;
        }

        /// <summary>
        /// 엑셀을 DATASET으로 전환후 DELETE 하는 메소드 
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="headerVisible"></param>
        /// <returns></returns>
        public static DataSet ExcelDelete2DataSet(string filePath, bool headerVisible)
        {
            DataSet ds = StringManager.Excel2DataSet(filePath, headerVisible);
            System.IO.File.Delete(filePath);
            return ds;

        }

        #endregion == Excel 또는 Text파일 -> DataSet으로 ==

        #region == DataTable2TextFile DataTable 의 내용을 텍스트 파일로 변환하는 함수 (4개 오버로드) ==

        /// <summary>
        /// DataTable 의 내용을 텍스트 파일로 변환하여 사용자의 로컬에 저장하는 함수
        /// </summary>
        /// <param name="filePath">저장할 경로(사용자가 SaveDialog 등을 활용하여 지정할 수 있도록 한다.)</param>
        /// <param name="fileName">저장할 파일명(UI 개발자가 업무에 정의된 파일명으로 지정한다.)</param>
        /// <param name="dt">텍스트 파일에 쓰여질 데이터정보 (UI 개발자가 형식에 맞게 가공하여 넘기도록 한다.)</param>
        /// <param name="columnLengths">각 열의 고정폭을 정수배열로 지정하여 넘기도록 한다.</param>
        /// <param name="headerVisible">텍스트 파일에 컬럼명을 쓰게할지 여부를 지정한다. true이면 컬럼명을 텍스트 파일에기입한다.</param>
        public static void DataTable2TextFile(string filePath, DataTable dt, ColumnLengthDelimiter[] colLenDelimiter, bool headerVisible)
        {
            System.Text.StringBuilder sbResult = null;
            System.IO.StreamWriter writer = null;
            try
            {
                sbResult = new System.Text.StringBuilder();
                if (DataTable2String(dt, colLenDelimiter, headerVisible, sbResult))
                {
                    writer = new System.IO.StreamWriter(System.IO.File.Create(filePath), Encoding.GetEncoding(949));
                    writer.Write(sbResult.ToString());
                    writer.Close();
                }
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sbResult != null) sbResult = null;
                if (writer != null)
                {
                    writer.Close();
                    writer = null;
                }
            }

        }

        /// <summary>
        /// DataTable 의 내용을 텍스트 파일로 변환하여 사용자의 로컬에 저장하는 함수
        /// </summary>
        /// <param name="filePath">저장할 경로(사용자가 SaveDialog 등을 활용하여 지정할 수 있도록 한다.)</param>
        /// <param name="fileName">저장할 파일명(UI 개발자가 업무에 정의된 파일명으로 지정한다.)</param>
        /// <param name="dt">텍스트 파일에 쓰여질 데이터정보 (UI 개발자가 형식에 맞게 가공하여 넘기도록 한다.)</param>
        /// <param name="delimiter">컬럼 구분자를 지정한다. 컬럼구분자는 "\t", ";", "," </param>
        /// <param name="headerVisible">텍스트 파일에 컬럼명을 쓰게할지 여부를 지정한다. true이면 컬럼명을 텍스트 파일에기입한다.</param>
        public static void DataTable2TextFile(string filePath, System.Data.DataTable dt, string delimiter, bool headerVisible)
        {
            System.Text.StringBuilder sbResult = null;
            System.IO.StreamWriter writer = null;
            try
            {
                sbResult = new System.Text.StringBuilder();
                if (DataTable2String(dt, delimiter, headerVisible, sbResult))
                {
                    writer = new System.IO.StreamWriter(System.IO.File.Create(filePath), Encoding.GetEncoding(949));
                    writer.Write(sbResult.ToString());
                    writer.Close();
                }
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sbResult != null) sbResult = null;
                if (writer != null)
                {
                    writer.Close();
                    writer = null;
                }
            }
        }


        /// <summary>
        /// DataTable 의 내용을 텍스트 포맷으로 변환하여 byte[]로 반환하는 함수
        /// </summary>
        /// <param name="dt">텍스트 파일에 쓰여질 데이터정보 (UI 개발자가 형식에 맞게 가공하여 넘기도록 한다.)</param>
        /// <param name="columnLengths">각 열의 고정폭을 정수배열로 지정하여 넘기도록 한다.</param>
        /// <param name="headerVisible">텍스트 파일에 컬럼명을 쓰게할지 여부를 지정한다. true이면 컬럼명을 텍스트 파일에기입한다.</param>
        /// <returns>byte[]</returns>
        public static byte[] DataTable2Binary(System.Data.DataTable dt, ColumnLengthDelimiter[] colLenDelimiter, bool headerVisible)
        {
            System.Text.StringBuilder sbResult = new System.Text.StringBuilder();
            System.IO.MemoryStream stream = new System.IO.MemoryStream();
            System.IO.StreamWriter writer = null;
            if (DataTable2String(dt, colLenDelimiter, headerVisible, sbResult))
            {
                writer = new System.IO.StreamWriter(stream, Encoding.GetEncoding(949));
                writer.Write(sbResult.ToString());
                writer.Close();
            }
            byte[] binary = stream.ToArray();
            stream.Close();
            return binary;
        }

        /// <summary>
        /// DataTable 의 내용을 텍스트 포맷으로 변환하여 byte[]로 반환하는 함수
        /// </summary>
        /// <param name="dt">텍스트 파일에 쓰여질 데이터정보 (UI 개발자가 형식에 맞게 가공하여 넘기도록 한다.)</param>
        /// <param name="delimiter">컬럼 구분자를 지정한다. 컬럼구분자는 "\t", ";", "," </param>
        /// <param name="headerVisible">텍스트 파일에 컬럼명을 쓰게할지 여부를 지정한다. true이면 컬럼명을 텍스트 파일에기입한다.</param>
        /// <returns>byte[]</returns>
        public static byte[] DataTable2Binary(System.Data.DataTable dt, string delimiter, bool headerVisible)
        {
            System.Text.StringBuilder sbResult = null;
            System.IO.MemoryStream stream = null;
            System.IO.StreamWriter writer = null;
            byte[] binary = null;
            try
            {
                sbResult = new System.Text.StringBuilder();
                if (DataTable2String(dt, delimiter, headerVisible, sbResult))
                {
                    stream = new System.IO.MemoryStream();
                    writer = new System.IO.StreamWriter(stream, Encoding.GetEncoding(949));
                    writer.Write(sbResult.ToString());
                    writer.Close();
                }
                binary = stream.ToArray();
                stream.Close();
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sbResult != null) sbResult = null;
                if (writer != null)
                {
                    writer.Close();
                    writer = null;
                }
                if (stream != null)
                {
                    stream.Close();
                    stream = null;
                }
            }
            return binary;
        }

        /// <summary>
        /// DataTable의 데이터를 텍스트로 변환한다.
        /// </summary>
        /// <param name="dt">DataTable</param>
        /// <param name="delimiter">열 구분자</param>
        /// <param name="headerVisible">컬럼헤더를 텍스트에 써야할지 여부</param>
        /// <param name="sbResult">반환되는 텍스트</param>
        /// <returns>성공여부(반환되는 텍스트가 없으면 false)</returns>
        private static bool DataTable2String(System.Data.DataTable dt, string delimiter, bool headerVisible, System.Text.StringBuilder sbResult)
        {
            //	delimiter가 허용된 구분자인지 확인
            //			string strDelimiter = "\t;,";
            //			if ( strDelimiter.IndexOf(delimiter) < 0 )
            //				throw new System.Exception("데이터를 텍스트로 변환하지 못했습니다. \r\n유효하지 않은 구분자 입니다.");

            //	sbResult의 인스턴스가 생성되지 않았으면 생성하도록 합니다.
            if (sbResult == null)
                sbResult = new System.Text.StringBuilder();

            //	헤더를 텍스트에 쓰는지 여부
            if (headerVisible)
            {
                foreach (System.Data.DataColumn col in dt.Columns)
                {
                    sbResult.Append(col.ColumnName);
                    sbResult.Append(delimiter);
                }
                sbResult.Remove(sbResult.Length - delimiter.Length, delimiter.Length);
                sbResult.Append("\r\n");
            }
            //	데이터를 텍스트로 변환
            foreach (System.Data.DataRow row in dt.Rows)
            {
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    sbResult.Append(row[i].ToString());
                    sbResult.Append(delimiter);
                }
                sbResult.Remove(sbResult.Length - delimiter.Length, delimiter.Length);
                sbResult.Append("\r\n");
            }
            return sbResult.Length > 0;
        }

        /// <summary>
        /// DataTable의 데이터를 텍스트로 변환한다.
        /// </summary>
        /// <param name="dt">DataTable</param>
        /// <param name="columnLengths">고정폭 배열</param>
        /// <param name="headerVisible">컬럼헤더를 텍스트에 써야할지 여부</param>
        /// <param name="sbResult">반환되는 텍스트</param>
        /// <returns>성공여부(반환되는 텍스트가 없으면 false)</returns>
        private static bool DataTable2String(System.Data.DataTable dt, ColumnLengthDelimiter[] colLenDelimiter, bool headerVisible, System.Text.StringBuilder sbResult)
        {
            // 고정폭 배열개수와 테이블의 컬럼 개수가 일치하는지 확인
            if (dt.Columns.Count != colLenDelimiter.Length)
                throw new System.Exception("데이터를 텍스트로 변환하지 못했습니다. \r\n데이터의 컬럼 개수와 고정폭 배열의 개수가 일치하지 않습니다.|^|");

            //	sbResult의 인스턴스가 생성되지 않았으면 생성하도록 합니다.
            if (sbResult == null)
                sbResult = new System.Text.StringBuilder();

            Encoding en = Encoding.GetEncoding(949);
            string format = string.Empty;
            string strData = string.Empty;
            byte[] ByteArray = null;
            //	헤더를 텍스트에 쓰는지 여부
            if (headerVisible)
            {
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    //	컬럼명의 텍스트가 지정된 폭보다 길면 예외가 발생합니다.
                    //		정책적으로 이것을 허용하려면 if 절 안에서 예외를 발생시키지 말고 if 절 안에서 컬럼명을 길이에 맞게 자르도록 수정하실 수도 있습니다.


                    ByteArray = new byte[colLenDelimiter[i].ColumnLength];
                    if (en.GetByteCount(dt.Columns[i].ColumnName) > System.Math.Abs(colLenDelimiter[i].ColumnLength))
                    {
                        string strMessage = string.Format("데이터를 텍스트로 변환하지 못했습니다. \r\n{0} 번째 컬럼명 {1}이(가) 지정된 컬럼의 너비보다 큽니다.|^|", i.ToString(), dt.Columns[i].ColumnName);
                        throw new System.Exception(strMessage);
                    }

                    en.GetBytes(dt.Columns[i].ColumnName, 0, dt.Columns[i].ColumnName.Length, ByteArray, 0);


                    if ((int)colLenDelimiter[i].ColumnAlign == 0)
                    {
                        format = string.Format("{{0,-{0}}}", (en.GetString(ByteArray)).Length);
                        strData = en.GetString(ByteArray).TrimEnd('\0').PadLeft((en.GetString(ByteArray)).Length, colLenDelimiter[i].PADChar);
                    }
                    else
                    {
                        format = string.Format("{{0,{0}}}", (en.GetString(ByteArray)).Length);
                        strData = en.GetString(ByteArray).TrimEnd('\0').PadRight((en.GetString(ByteArray)).Length, colLenDelimiter[i].PADChar);
                    }
                    sbResult.AppendFormat(format, strData);
                }
                sbResult.Append("\r\n");

                //ByteArray;
            }
            //	데이터를 텍스트로 변환
            System.Text.RegularExpressions.Regex regNumeric = new System.Text.RegularExpressions.Regex(@"^[+-]?\d+(\.\d+)?$");  //	데이터가 숫자인지 판단하는 정규식
            for (int j = 0; j < dt.Rows.Count; j++)
            {
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    ByteArray = new byte[colLenDelimiter[i].ColumnLength];


                    if (en.GetByteCount(dt.Rows[j][i].ToString()) > System.Math.Abs(colLenDelimiter[i].ColumnLength))
                    {
                        string strMessage = string.Format(
                            "데이터를 텍스트로 변환하지 못했습니다. \r\n{0} 번째 레코드의 {1} 번째 열 {2}이(가) 지정된 컬럼의 너비보다 큽니다.|^|"
                            , j.ToString(), i.ToString(), dt.Rows[j][i].ToString());
                        throw new System.Exception(strMessage);
                    }
                    en.GetBytes(dt.Rows[j][i].ToString(), 0, dt.Rows[j][i].ToString().Length, ByteArray, 0);

                    if ((int)colLenDelimiter[i].ColumnAlign == 0)
                    {
                        format = string.Format("{{0,-{0}}}", (en.GetString(ByteArray)).Length);
                        strData = en.GetString(ByteArray).TrimEnd('\0').PadLeft((en.GetString(ByteArray)).Length, colLenDelimiter[i].PADChar);
                    }
                    else
                    {
                        format = string.Format("{{0,{0}}}", (en.GetString(ByteArray)).Length);
                        strData = en.GetString(ByteArray).TrimEnd('\0').PadRight((en.GetString(ByteArray)).Length, colLenDelimiter[i].PADChar);
                    }
                    sbResult.AppendFormat(format, strData);
                }
                sbResult.Append("\r\n");
            }
            return sbResult.Length > 0;
        }

        #endregion == DataTable2TextFile DataTable 의 내용을 텍스트 파일로 변환하는 함수 (4개 오버로드) ==

        #region ColumnLengthDelimiter

        public class ColumnLengthDelimiter
        {
            public enum Align
            {
                Left,
                Right
            }

            Align align;
            int columnlength = 0;
            char padChar;

            public ColumnLengthDelimiter(int columnLength, Align align, char padChar)
            {
                this.align = align;
                this.columnlength = columnLength;
                this.padChar = padChar;
            }

            public int ColumnLength
            {
                get { return this.columnlength; }
            }
            public Align ColumnAlign
            {
                get { return this.align; }
            }
            public char PADChar
            {
                get { return this.padChar; }
            }
        }

        #endregion

        /// <summary>
        /// DB 인서트 전 문자열 Replace<para></para>
        /// <example ><![CDATA[ 
        /// & => &amp;
        /// < => &lt;
        /// > => &gt;
        /// ' => ''
        /// " => &quot;
        /// ]]></example>
        /// </summary>
        /// <param name="strVal">바꿀 문자열</param>
        /// <returns>바뀐 문자열</returns>
        public static string EncodeChar(string value)
        {
            string strTmp = value;
            strTmp = strTmp.Replace("&", "&amp;");
            strTmp = strTmp.Replace("<", "&lt;");
            strTmp = strTmp.Replace(">", "&gt;");
            strTmp = strTmp.Replace("'", "''");
            strTmp = strTmp.Replace("\"", "&quot;");
            return strTmp;
        }

        /// <summary>
        /// 화면 출력 문자열 Replace<para></para>
        /// <example ><![CDATA[ 
        /// &amp;  => &
        /// &lt;   => <
        /// &gt;   => >
        /// ''     => '
        /// &quot; => "
        /// ]]></example>
        /// </summary>
        /// <param name="strVal">바꿀 문자열</param>
        /// <returns>바뀐 문자열</returns>
        public static string DecodeChar(string value)
        {
            string strTmp = value;
            strTmp = strTmp.Replace("&amp;", "&");
            strTmp = strTmp.Replace("&lt;", "<");
            strTmp = strTmp.Replace("&gt;", ">");
            strTmp = strTmp.Replace("''", "'");
            strTmp = strTmp.Replace("&quot;", "\"");
            return strTmp;
        }


        /// <summary>
        /// 
        /// </summary>
        public static string FILE_BYTE_ARRAY_DELIMITTER = ";;;;;;;;;;";

        /// <summary>
        /// 파일패스 배열을 통해 파일의 byte[]를 만들어 string으로 변환하여 리턴
        /// </summary>
        /// <param name="arrFiles">파일패스 배열</param>
        /// <returns>파일의 byte[]를 변환한 string</returns>
        public static string GetFileStringByFile(string[] arrFiles)
        {
            byte[][] arrFileByte = null;
            StringBuilder sb = null;
            string strResult = string.Empty;
            if (arrFiles != null && arrFiles.Length > 0)
            {
                sb = new StringBuilder();

                // 원본 파일명 정보
                for (int i = 0; i < arrFiles.Length; i++)
                    sb.Append(System.IO.Path.GetFileName(arrFiles[i]) + FILE_BYTE_ARRAY_DELIMITTER);

                // 파일명과 파일은 Delimitter 두개가 붙은 것이 구분자이다..
                sb.Append(FILE_BYTE_ARRAY_DELIMITTER);

                // 원본 파일
                arrFileByte = new byte[arrFiles.Length][];
                for (int i = 0; i < arrFiles.Length; i++)
                {
                    arrFileByte[i] = StringManager.ReadBinaryFile(arrFiles[i]);

                    char[] chArr = ByteArrayToCharArray(arrFileByte[i]);
                    for (int j = 0; j < chArr.Length; j++)
                        sb.Append(chArr[j]);

                    if (i < (arrFiles.Length - 1))
                        sb.Append(FILE_BYTE_ARRAY_DELIMITTER);
                }
                strResult = sb.ToString();
            }

            return strResult;
        }


        /// <summary>
        /// 첫번째 문자부터 시작하는 부분 문자열을 리턴합니다. (원하는 length가 더 크면 문자열의 끝까지 리턴)<br/>
        /// </summary>
        /// <param name="text">문자열</param>
        /// <param name="length">부분 문자열에 있는 문자의 수입니다.</param>
        /// <returns></returns>
        public static string GetSubstring(string text, int length)
        {
            return GetSubstring(text, 0, length);
        }

        /// <summary>
        /// 부분 문자열을 리턴합니다. (원하는 length가 더 크면 문자열의 끝까지 리턴)<br/>
        /// </summary>
        /// <param name="text">문자열</param>
        /// <param name="startIndex">부분 문자열의 처음 위치에 대한 인덱스입니다.</param>
        /// <param name="length">부분 문자열에 있는 문자의 수입니다.</param>
        /// <returns></returns>
        public static string GetSubstring(string text, int startIndex, int length)
        {
            if (text.Length == 0) return String.Empty;
            if ((text.Length - startIndex) < 0) return String.Empty;

            if ((startIndex + length) > text.Length)
                return text.Substring(startIndex, (text.Length - startIndex));
            else
                return text.Substring(startIndex, length);
        }

        /// <summary>
        /// 부분 문자열을 리턴합니다. (원하는 length가 더 크면 문자열의 끝까지 리턴)<br/>
        /// </summary>
        /// <param name="text">문자열</param>
        /// <param name="startIndex">부분 문자열의 처음 위치에 대한 인덱스입니다.</param>
        /// <param name="length">부분 문자열에 있는 문자의 수입니다.</param>
        /// <returns></returns>
        public static string GetSubstring(object text, int startIndex, int length)
        {
            string strText = text as string;
            if (strText == null) return String.Empty;

            return GetSubstring(strText, startIndex, length);
        }

        /// <summary>
        /// 첫번째 문자부터 시작하는 부분 문자열을 리턴합니다. (원하는 length가 더 크면 문자열의 끝까지 리턴)<br/>
        /// </summary>
        /// <param name="text">문자열</param>
        /// <param name="length">부분 문자열에 있는 문자의 수입니다.</param>
        /// <returns></returns>
        public static string GetSubstring(object text, int length)
        {
            string strText = text as string;
            if (strText == null) return String.Empty;

            return GetSubstring(strText, 0, length);
        }
    }
}
