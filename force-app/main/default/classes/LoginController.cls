public without sharing class LoginController {
    public LoginController() {

    }

    @AuraEnabled
    public static string startLogin(String username, String password){
        try {    
            String startUrl = 'https://wise-raccoon-kefkh5-dev-ed.preview.salesforce-communities.com/spotiforce/s/?app=commeditor';
            ApexPages.PageReference pageRef = Site.login(username, password, startUrl);

            if(pageRef != null) return pageRef.getUrl();
            throw new CalloutException();
            //return null;
        } catch (Exception e) {
            system.debug('e.getMessagelogin+   '+e.getMessage());
            throw new AuraHandledException(e.getMessage());
            //return null;
        }
    }
}