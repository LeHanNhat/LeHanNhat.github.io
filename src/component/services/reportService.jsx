import axios from "axios"

const baseUrl = "/api/report";

export const reportProductPerDate= async(month,year)=>{
    try 
    {
      console.log(month," ",year);
      
        const reponse = await axios.get(`${baseUrl}/revenue/daily?year=${year}&month=${month}`);

        console.log("after response: ", reponse.data);
        
        return reponse.data ? reponse.data : ""
    } catch (error) {
        console.log(error);
        
    }
}

export const reportProductPerMonth= async(year)=>{
    try {
        const reponse = await axios.get(`${baseUrl}/revenue/monthly?year=${year}`);

       
        
        return reponse.data ? reponse.data : ""
    } catch (error) {
        console.log(error);
        
    }
}


export const exportReport = async () => {
    try {
      const response = await axios.get(`${baseUrl}/product-sales/excel`, {
        responseType: 'blob', 
      });
  
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  export const reportStats = async () => {
    try {
        const response = await axios.get(`${baseUrl}/payment-stats`);
        return response.data ? response.data : ""
    } catch (error) {
        console.log(error);
        
    }
  }