#! /bin/bash

secure_regular (){    
    # 1st layer of main obfuscation
    echo ""
    echo "Preparing domainlock ..."
    echo ""
    rm domainlock.js
    python prep_domainlock.py 'lib/game/main.js' 'domainlock.js' 'this.START_OBFUSCATION;' 'this.END_OBFUSCATION;'

    # domainlock breakout attempt info
    echo ""
    echo "Injecting Domainlock Breakout Attempt info"
    echo ""
    python inject_domainlock_breakout_info.py 'domainlock.js'
    
    # suppress console functions, freeze console and context2D
    # echo ""
    # echo "Injecting Anti-Tampering protection code"
    # echo ""
    # python inject_protection.py 'domainlock.js'
    
    echo ""
    echo "Preparing factory domainlock ..."
    echo ""
    prep_factory_domainlock

    echo ""
    echo "Injecting domainlock ..."
    echo ""
    python inject_domainlock.py 'domainlock.js' 'game.js' 'this.START_OBFUSCATION;' 'this.END_OBFUSCATION'

    echo ""
    echo "Cleaning up domainlock ..."
    echo ""
    rm domainlock.js

    # global obfuscation
    echo ""
    echo "Securing by obscuring ..."
    echo ""
    javascript-obfuscator 'game.js' -o 'game.js' --config 'tools/javascript-obfuscator-dev.json'
	sed -i.bak 's/{data;}else{return;}/{}else{return;}/g' game.js
	rm *.bak

    echo ""
    echo "Securing Done!"
    echo ""

}

# Build the game
echo "[woso]: Building the game..."
sh push.sh -b

secure_regular

# Setting unique value to to the game.js. in order to clear Cloudfront cache
_VERSION="v$(date +%s)"
echo "Injecting the version into index.html ..."
sed -i.bak 's/game.js/game.js?'$_VERSION'/g' index.html
sed -i.bak 's/game.css/game.css?'$_VERSION'/g' index.html
rm *.bak

# Push to s3
echo "[woso]: Push to S3..."
python boto-s3-upload-production.py -l en -a

# Send verification that clouldfront cache need to be cleared
echo "[woso]: Reset cloudfront cache..."
python cloudfront_invalidate_cache_production.py