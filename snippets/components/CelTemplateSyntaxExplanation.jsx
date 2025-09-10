const CelTemplateSyntaxExplanation = () => {
	const templateSyntax = "${}";

	return (
		<>
			
				The results of CEL expressions can be interpolated into your policy's{" "}
				config using ngrok's {templateSyntax}{" "}
				templating syntax.{" "}
				
					For a complete list of available variables and functions or to see a
					more detailed explanation, checkout the{" "}
					docs.
				
			
		
	);
};

export default CelTemplateSyntaxExplanation;
