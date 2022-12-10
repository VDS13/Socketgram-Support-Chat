<?php
    require_once "../../config/const.php";
    class Log_in {
        function __construct($login, $password) {
            $this->ad = ldap_connect(HOST_LDAP.":".PORT_LDAP);
            ldap_set_option($this->ad, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($this->ad, LDAP_OPT_REFERRALS, 0);
            ldap_set_option($this->ad, LDAP_OPT_DEREF, 1);
            $this->login = $login;
            $this->password = $password;
        }
        function getDN($ad, $samaccountname, $basedn) {
            $user = USER_LDAP;
            $password = PASSWORD_LDAP;
            @ldap_bind($this->ad, $user, $password);
            $result = ldap_search($ad, $basedn, "(uid={$samaccountname}*)", array(
              'dn'
            ));
            if (! $result) {
                return '';
            }
    
            $entries = ldap_get_entries($ad, $result);
            if ($entries['count'] > 0) {
                return $entries[0]['dn'];
            }
            return '';
        }
        function checkAuth($ad, $samaccountname, $group1, $userdn) {
            @ldap_bind($this->ad, $userdn, $this->password);
            $result = ldap_search($ad, $group1, "memberuid=".$samaccountname, array("memberuid=".$samaccountname));
            if (!$result) {
                return '';
            }
    
            $entries = ldap_get_entries($ad, $result);
            if ($entries['count'] > 0) {
                return 1;
            }
            return '';
        }
        function auth() {
            $basedn = BASEDB_LDAP;
            $group = GROUP_LDAP;
            $userdn = $this->getDN($this->ad, $this->login, $basedn);
            return $this->checkAuth($this->ad, $this->login, $group, $userdn);
        }
    }