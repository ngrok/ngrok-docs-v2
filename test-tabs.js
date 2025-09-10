#!/usr/bin/env node

const { processFileContent } = require('./update-tabs.js');

// Test with the content from connect-url.mdx
const testContent = `---
title: Connect URLs
sidebar_label: Connect URLs
---

import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";

import CustomIngressAgentCliExample from "/snippets/examples/agent-cli/custom-agent-ingress.mdx";

# Connect URL 

## Overview

<Tabs groupId="agent-type" queryString="agent-type">
	<TabItem value="agent-cli" label="Agent CLI" default>
		<CustomIngressAgentCliExample />
	</TabItem>
	<TabItem value="agent-config" label="Agent Config">
		<CustomIngressAgentConfigExample />
	</TabItem>
</Tabs>

Some other content...

<Tabs queryString="example-type" defaultValue="basic">
	<TabItem value="basic" label="Basic Example">
		Basic content
	</TabItem>
	<TabItem value="advanced" label="Advanced Example" default>
		Advanced content
	</TabItem>
</Tabs>`;

console.log('Original content:');
console.log('================');
console.log(testContent);

console.log('\n\nProcessed content:');
console.log('==================');
const processed = processFileContent(testContent);
console.log(processed);
