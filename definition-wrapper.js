const terms = [
	// Please add new terms in alphabetical order.
	{
		titles: ["ALPN"],
		caseSensitive: true,
		link: "https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation",
		meaning:
			"ALPN (Application-Layer Protocol Negotiation) allows a client and server to negotiate which application protocol (like HTTP/2 or HTTP/1.1) to use over a secure connection during the TLS handshake.",
	},
	{
		titles: ["CEL"],
		caseSensitive: true,
		link: "https://github.com/google/cel-spec/tree/master?tab=readme-ov-file#common-expression-language",
		meaning:
			"CEL (Common Expression Language) is a fast, safe, and portable expression language developed by Google for evaluating expressions in configuration, policy, and runtime environments.",
	},
	{
		titles: ["CRD"],
		caseSensitive: true,
		meaning:
			"CustomResourceDefinitions allow users to extend the Kubernetes API by defining their own resource types.",
		link: "https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/",
		pluralEnding: "s",
	},
	{
		titles: ["Endpoint Pooling", "Endpoint pool"],
		meaning:
			'When your create two ngrok endpoints with the same URL (and binding), those endpoints automatically form a "pool" and share incoming traffic.',
		link: "/docs/universal-gateway/endpoint-pooling/",
		pluralEnding: "s",
	},
	{
		titles: ["Gateway API CRD", "Gateway API"],
		link: "https://gateway-api.sigs.k8s.io/guides/",
		meaning:
			"Gateway API CRDs (Custom Resource Definitions) are a set of standardized, extensible resources that manage networking configurations like routing, gateways, and traffic policies.",
		pluralEnding: "s",
	},
	{
		titles: ["Helm"],
		meaning:
			"Helm is a package manager for Kubernetes that simplifies the deployment and management of applications on Kubernetes clusters.",
		link: "https://helm.sh/",
	},
	{
		titles: ["Ingress"],
		meaning:
			"An ingress is an entry point into a network for traffic from outside of the network.",
		pluralEnding: "es",
	},
	{
		titles: ["IP CIDR", "CIDR"],
		meaning:
			"Classless Inter-Domain Routing is a method used to allocate IP addresses more efficiently and route IP packets more flexibly than older class-based systems.",
		link: "https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing",
		pluralEnding: "s",
	},
	{
		titles: ["JIT provisioning"],
		meaning:
			"Just-In-Time Single Sign-On Provisioning is a user account provisioning method that automatically creates (or updates) user accounts at the time of login via Single Sign-On, rather than pre-creating all user accounts in advance.",
		link: "https://en.wikipedia.org/wiki/System_for_Cross-domain_Identity_Management",
	},
	{
		titles: ["K8"],
		meaning: "K8s is an industry-standard abbreviation for Kubernetes.",
		pluralEnding: "s",
		link: "https://kubernetes.io/docs/concepts/overview/",
	},
	{
		titles: ["Let's Encrypt", "Let's Encrypt", "LetsEncrypt", "Lets encrypt"],
		meaning:
			"Let's Encrypt is a free, automated, and open certificate authority (CA) that provides digital certificates to enable HTTPS (SSL/TLS) for websites.",
		link: "https://letsencrypt.org/about/",
	},
	{
		titles: ["MCP server", "MCP"],
		meaning:
			"MCP (Model Context Protocol) is an open standard that allows AI models to access external data, tools, and services, and potentially use them to automate workflows.",
		link: "https://en.wikipedia.org/wiki/Model_Context_Protocol",
		pluralEnding: "s",
	},
	{
		titles: ["OIDC"],
		meaning:
			"OpenID Connect (OIDC) is an authentication protocol that enables third-party applications to confirm a user's identity and access basic profile details through a single sign-on (SSO) process.",
		link: "https://en.wikipedia.org/wiki/OpenID",
	},
	{
		titles: ["OWASP"],
		caseSensitive: true,
		meaning:
			"The Open Web Application Security Project is a non-profit organization dedicated to improving software security through providing resources, tools, and community support.",
		link: "https://owasp.org/about/",
	},
	{
		titles: ["reverse proxy", "reverse proxies"],
		link: "https://en.wikipedia.org/wiki/Reverse_proxy",
		meaning:
			"Reverse proxies are an extra security layer between public traffic and your internal services. They live on servers or cloud services, and they intercept and forward traffic to upstream services.",
	},
	{
		titles: ["shadow IT"],
		meaning:
			"Shadow IT refers to IT systems, software, and cloud services used by individuals within an organization without the IT department's knowledge or approval",
		link: "https://en.wikipedia.org/wiki/Shadow_IT",
	},
	{
		titles: ["SNI"],
		caseSensitive: true,
		link: "https://en.wikipedia.org/wiki/Server_Name_Indication",
		meaning:
			"SNI (Server Name Indication) is a TLS extension that allows a client to specify the hostname it is trying to connect to during the TLS handshake, enabling servers to present the correct SSL/TLS certificate for that hostname.",
	},
	{
		titles: [
			"TCP-KeepAlive",
			"TCP KeepAlive",
			"TCP Keep-Alive",
			"TCP Keep Alive",
		],
		meaning:
			"TCP KeepAlive enables TCP connections to remain active even when no data is exchanged between the connected endpoints.",
		link: "https://en.wikipedia.org/wiki/Keepalive",
	},
	{
		titles: ["TLS Certificate"],
		pluralEnding: "s",
		link: "https://en.wikipedia.org/wiki/Transport_Layer_Security",
		meaning:
			"A TLS certificate (or SSL certificate) is a digital certificate that ensure your connection to a website or server is securly encrypted.",
	},
	{
		titles: ["TLS Termination"],
		meaning:
			"TLS (Transport Layer Security) termination is the process of decrypting incoming TLS traffic at a server or load balancer before passing the unencrypted traffic to internal systems.",
		link: "/docs/universal-gateway/tls-termination/",
	},
	{
		titles: ["Traffic Policy", "Traffic Policies"],
		meaning:
			"Traffic Policy is a configuration language that enables you to filter, match, manage and orchestrate traffic to your endpoints. For example, you can add authentication, send custom response, rate limit traffic, and more.",
		link: "/docs/traffic-policy/",
	},
	{
		titles: ["v2"],
		caseSensitive: true,
		meaning: "v2 is shorthand for the second major version of the ngrok Agent.",
		link: "/docs/agent/config/v2",
	},
	{
		titles: ["v3"],
		caseSensitive: true,
		meaning: "v3 is shorthand for the third major version of the ngrok Agent.",
		link: "/docs/agent/config/v3",
	},
	{
		titles: ["WAF"],
		link: "https://en.wikipedia.org/wiki/Web_application_firewall",
		caseSensitive: true,
		meaning:
			"A web application firewall (WAF) is an intermediary service in the cloud or on a server that protects web services by filtering and monitoring HTTP traffic.",
	},
];


console.log("Hi");

function wrapTermsOnLoad() {
  console.log("Hello - starting term wrapping");
  console.log("Terms loaded:", terms.length);
  
  // Get page title to check against
  const pageTitle = document.getElementById('page-title');
  const pageTitleText = pageTitle ? pageTitle.textContent.toLowerCase() : '';
  console.log("Page title text:", pageTitleText);
  
  // Get all mdx-content containers
  const mdxContainers = document.querySelectorAll('div[class*="mdx-content"]');
  console.log("Found mdx containers:", mdxContainers.length);
  
  // Track which terms have been wrapped to only wrap the first instance
  const wrappedTerms = new Set();
  
  mdxContainers.forEach((container, containerIndex) => {
    console.log(`Processing container ${containerIndex}`);
    
    // Find all p spans and li elements within this container
    const pSpans = container.querySelectorAll('span[data-as="p"]');
    const listItems = container.querySelectorAll('li');
    const elementsToProcess = [...pSpans, ...listItems];
    
    console.log(`Found ${pSpans.length} p spans and ${listItems.length} li elements`);
    
    elementsToProcess.forEach((element, elementIndex) => {
      const elementText = element.textContent;
      console.log(`Processing element ${elementIndex}: "${elementText.substring(0, 50)}..."`);
      
      // Check specifically for TCP-KeepAlive
      if (elementText.includes('TCP-KeepAlive')) {
        console.log("Found TCP-KeepAlive in element:", elementText);
      }
      
      terms.forEach(termObj => {
        termObj.titles.forEach(termTitle => {
          // Skip if this term is already wrapped or if it appears in the page title
          if (wrappedTerms.has(termTitle) || pageTitleText.includes(termTitle.toLowerCase())) {
            return;
          }
          
          // Check specifically for TCP-KeepAlive
          if (termTitle === 'TCP-KeepAlive' && elementText.includes('TCP-KeepAlive')) {
            console.log("Processing TCP-KeepAlive term");
          }
          
          // Create regex for term matching (no global flag to replace only first occurrence)
          const flags = termObj.caseSensitive ? '' : 'i';
          const regex = new RegExp(`\\b${escapeRegex(termTitle)}\\b`, flags);
          
          // Check if term exists in this element
          if (regex.test(element.textContent)) {
            console.log(`Found match for term: ${termTitle} in element:`, element.textContent.substring(0, 100));
            
            // Replace only the first occurrence
            const originalHTML = element.innerHTML;
            const wrappedHTML = originalHTML.replace(regex, (match) => {
              console.log(`Wrapping term: ${match}`);
              const definition = termObj.meaning || 'Definition not available';
              const link = termObj.link || '';
              
              return `<button data-state="closed" data-tooltip="${escapeHtml(definition)}" ${link ? `data-link="${link}"` : ''}><span class="tooltip underline decoration-dotted decoration-2 underline-offset-4 decoration-gray-400 dark:decoration-gray-500">${match}</span></button>`;
            });
            
            // Only update if something changed
            if (originalHTML !== wrappedHTML) {
              console.log(`Updating innerHTML for term: ${termTitle}`);
              console.log(`Original:`, originalHTML);
              console.log(`New:`, wrappedHTML);
              
              // Try multiple approaches to update DOM
              element.innerHTML = wrappedHTML;
              
              // Force a reflow
              element.offsetHeight;
              
              // Add tooltip event listeners to the newly created buttons
              const tooltipButtons = element.querySelectorAll('button[data-tooltip]');
              tooltipButtons.forEach(button => {
                addTooltipBehavior(button);
              });
              
              // Check if the change stuck
              setTimeout(() => {
                const currentHTML = element.innerHTML;
                console.log(`Check after timeout - Current HTML:`, currentHTML);
                console.log(`Did change persist?`, currentHTML.includes('data-state="closed"'));
                
                if (!currentHTML.includes('data-state="closed"')) {
                  console.warn(`DOM change was reverted for term: ${termTitle}`);
                }
              }, 100);
              
              wrappedTerms.add(termTitle);
              return; // Exit early since we only want first instance
            }
          }
        });
      });
    });
  });
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addTooltipBehavior(button) {
  const tooltip = button.getAttribute('data-tooltip');
  const link = button.getAttribute('data-link');
  
  if (!tooltip) return;
  
  let tooltipElement = null;
  
  function showTooltip(e) {
    console.log('Showing tooltip for:', tooltip);
    
    // Remove any existing tooltip
    hideTooltip();
    
    // Create tooltip element
    tooltipElement = document.createElement('div');
    tooltipElement.textContent = tooltip;
    
    // Style to match the image - dark rounded rectangle with white text
    tooltipElement.style.cssText = `
      position: fixed !important;
      z-index: 999999 !important;
      background-color: #000000 !important;
      color: white !important;
      padding: 8px 12px !important;
      border-radius: 8px !important;
      font-size: 13px !important;
      font-weight: 400 !important;
      line-height: 1.3 !important;
      max-width: 320px !important;
      min-width: fit-content !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      white-space: normal !important;
      pointer-events: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      box-sizing: border-box !important;
    `;
    
    // Position tooltip above the element like in the image
    const rect = button.getBoundingClientRect();
    
    // Add to body first to measure
    document.body.appendChild(tooltipElement);
    const tooltipRect = tooltipElement.getBoundingClientRect();
    
    // Center horizontally and position above (using fixed positioning, so no scroll offset needed)
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 8;
    
    // Keep tooltip on screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    
    // If no room above, show below
    if (top < 10) {
      top = rect.bottom + 8;
    }
    
    tooltipElement.style.left = left + 'px';
    tooltipElement.style.top = top + 'px';
    
    console.log('Tooltip positioned at:', left, top);
    console.log('ScrollX/ScrollY:', scrollX, scrollY);
    console.log('Button rect:', rect);
    console.log('Tooltip rect:', tooltipRect);
    console.log('Calculation: rect.top + scrollY - tooltipHeight - 8 =', rect.top, '+', scrollY, '-', tooltipRect.height, '- 8 =', top);
    
    // Force a check after a frame
    requestAnimationFrame(() => {
      console.log('After frame - Tooltip still in DOM:', document.body.contains(tooltipElement));
      console.log('After frame - Tooltip bounding rect:', tooltipElement.getBoundingClientRect());
    });
    
    // Add click behavior if there's a link
    if (link) {
      button.style.cursor = 'pointer';
      button.onclick = () => {
        if (link.startsWith('http')) {
          window.open(link, '_blank');
        } else {
          window.location.href = link;
        }
      };
    }
  }
  
  function hideTooltip() {
    if (tooltipElement) {
      console.log('Hiding tooltip');
      tooltipElement.remove();
      tooltipElement = null;
    }
  }
  
  // Add event listeners
  button.addEventListener('mouseenter', showTooltip);
  button.addEventListener('mouseleave', hideTooltip);
  button.addEventListener('focus', showTooltip);
  button.addEventListener('blur', hideTooltip);
}

// Run on page load with multiple timing attempts
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded - trying immediately");
    wrapTermsOnLoad();
    
    // Also try after a delay in case framework re-renders
    setTimeout(() => {
      console.log("Trying again after 500ms delay");
      wrapTermsOnLoad();
    }, 500);
    
    setTimeout(() => {
      console.log("Trying again after 1s delay");
      wrapTermsOnLoad();
    }, 1000);
  });
} else {
  console.log("Document already loaded - trying immediately");
  wrapTermsOnLoad();
  
  // Also try after delays
  setTimeout(() => {
    console.log("Trying again after 500ms delay");
    wrapTermsOnLoad();
  }, 500);
}
