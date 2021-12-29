import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { ResponsiveNetworkCanvas, canvasDefaultProps as defaults } from '@nivo/network'
import { generateNetworkData } from '@nivo/generators'
import { ComponentTemplate } from '../../components/components/ComponentTemplate'
import meta from '../../data/components/network/meta.yml'
import mapper from '../../data/components/network/mapper'
import { groups } from '../../data/components/network/props'

const initialProperties = Object.freeze({
    pixelRatio:
        typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1,

    margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },

    linkDistance: 'distance',
    repulsivity: 4,
    iterations: 60,

    nodeSize: defaults.nodeSize,
    nodeColor: '#ff0000', // node => node.color,
    nodeBorderWidth: 1,
    nodeBorderColor: { theme: 'background' },

    linkColor: defaults.linkColor,
    linkThickness: defaults.linkThickness,

    isInteractive: true,
})

const generateData = () => generateNetworkData()

const NetworkCanvas = () => {
    const {
        image: {
            childImageSharp: { gatsbyImageData: image },
        },
    } = useStaticQuery(graphql`
        query {
            image: file(absolutePath: { glob: "**/src/assets/captures/network-canvas.png" }) {
                childImageSharp {
                    gatsbyImageData(layout: FIXED, width: 700, quality: 100)
                }
            }
        }
    `)

    return (
        <ComponentTemplate
            name="NetworkCanvas"
            meta={meta.NetworkCanvas}
            icon="network"
            flavors={meta.flavors}
            currentFlavor="canvas"
            properties={groups}
            initialProperties={initialProperties}
            defaultProperties={defaults}
            propertiesMapper={mapper}
            generateData={() =>
                generateData({
                    rootNodeRadius: 10,
                    maxMidNodes: 32,
                    midNodeRadius: 6,
                    leafRadius: 3,
                })
            }
            getDataSize={data => data.nodes.length}
            image={image}
        >
            {(properties, data, theme, logAction) => {
                return (
                    <ResponsiveNetworkCanvas
                        data={data}
                        {...properties}
                        theme={theme}
                        onClick={node => {
                            logAction({
                                type: 'click',
                                label: `[node] id: ${node.id}, index: ${node.index}`,
                                color: node.color,
                                data: node,
                            })
                        }}
                    />
                )
            }}
        </ComponentTemplate>
    )
}

export default NetworkCanvas
