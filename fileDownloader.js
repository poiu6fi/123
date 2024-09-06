
function downloadFilesFromUrl(url) {
    // 使用 jQuery 的 Ajax 加載目標 URL 的 HTML 內容
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    $.ajax({
        url: proxyUrl+url,
        method: 'GET',
        success: function(response) {
        // 將返回的 HTML 內容轉換為 jQuery 對象
        var htmlContent = $(response);

        // 選擇所有可能的文件鏈接（假設以常見文件類型結尾）
        var fileLinks = htmlContent.find("a[href$='.pdf'], a[href$='.doc'], a[href$='.docx'], a[href$='.xls'], a[href$='.xlsx'], a[href$='.zip'], a[href$='.odt'], a[href$='.ods']");

        // 遍歷每個文件鏈接
        fileLinks.each(function() {
            var link = $(this).attr('href'); // 獲取文件的 href 屬性
            var fileName = link.split('/').pop(); // 從 URL 提取文件名

            // 如果鏈接是相對路徑，則轉換為絕對路徑
            if (!link.startsWith('http')) {
            var absoluteLink = new URL(link, url).href;
            link = absoluteLink;
            }

            // 打印正在抓取的文件URL
            console.log('Downloading file from URL:', link);

            // 使用 Fetch API 下載文件並使用 FileSaver.js 保存文件
            fetch(proxyUrl+link)
            .then(response => response.blob()) // 將響應轉換為 Blob
            .then(blob => {
                console.log('Downloaded:', fileName); // 顯示已下載的文件名
                saveAs(blob, fileName); // 使用 FileSaver.js 的 saveAs 函數保存文件
            })
            .catch(error => console.error('Error downloading file:', error));
        });
        },
        error: function(error) {
        console.error('Error loading the page:', error);
        }
    });
    }